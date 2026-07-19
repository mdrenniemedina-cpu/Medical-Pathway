import { Body, Controller, Post } from '@nestjs/common';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { EventosProductoRepository } from './eventos-producto.repository';

/**
 * Eventos que el FRONTEND puede reportar directamente (interacción de UI sin
 * cambio de estado de dominio detrás). Deliberadamente NO incluye
 * `recomendacion_generada` ni `inicio_de_ruta` — esos se derivan
 * automáticamente de eventos de dominio reales (ver
 * `dominio-a-analitica.subscriber.ts`), para que no dependan de que el
 * frontend efectivamente dispare la llamada (más confiables, ver
 * `docs/16-hipotesis-sprint-1.md`).
 */
const EVENTOS_PERMITIDOS_DESDE_FRONTEND = [
  'cuestionario_iniciado',
  'cuestionario_completado',
  'cuestionario_abandonado_en_pregunta',
  'destino_explorado',
  'acciones_recomendadas_vistas',
  'proyeccion_visualizada',
  'interes_comunidad_expresado',
  'interes_radar_expresado',
] as const;

class RegistrarEventoDto {
  @IsIn(EVENTOS_PERMITIDOS_DESDE_FRONTEND)
  tipoEvento!: (typeof EVENTOS_PERMITIDOS_DESDE_FRONTEND)[number];

  @IsOptional()
  @IsString()
  perfilId?: string;

  @IsOptional()
  @IsObject()
  propiedades?: Record<string, unknown>;
}

@Controller('analitica')
export class AnalyticsController {
  constructor(private readonly eventos: EventosProductoRepository) {}

  @Post('eventos')
  async registrar(@Body() dto: RegistrarEventoDto): Promise<{ ok: true }> {
    await this.eventos.registrar({
      tipoEvento: dto.tipoEvento,
      perfilId: dto.perfilId,
      origen: 'frontend',
      propiedades: dto.propiedades,
    });
    return { ok: true };
  }
}
