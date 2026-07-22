import { Body, Controller, Post } from '@nestjs/common';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { HistoriaMedicoRepository } from './historia-medico.repository';

const ETAPAS_FORMACION = [
  'estudiante',
  'internado',
  'servicio_social',
  'medico_general',
  'residente',
  'especialista',
] as const;

const NIVELES_SERIO_INTERES = [
  'idea',
  'lo_he_pensado_varias_veces',
  'investigando_opciones',
  'decidido',
  'ya_inicie_proceso',
] as const;

const NIVELES_CONSIDERARIA_PAGAR = ['si', 'tal_vez', 'no'] as const;

const RANGOS_PRECIO = ['menos_5', '5_10', '10_20', '20_30', '30_50', 'mas_50'] as const;

const MAX_TEXTO_LIBRE = 2000;

/**
 * Endpoint público (sin JwtAuthGuard, sin cuenta requerida) — fricción
 * mínima a propósito, ver `public/comparte-tu-historia.html`. Acepta el
 * envío completo (10 preguntas) o el envío corto cuando el usuario responde
 * "No" en la pregunta 2 (solo etapaFormacion + haImaginadoEjercerOtroPais).
 */
class RegistrarHistoriaMedicoDto {
  @IsIn(ETAPAS_FORMACION)
  etapaFormacion!: (typeof ETAPAS_FORMACION)[number];

  @IsBoolean()
  haImaginadoEjercerOtroPais!: boolean;

  @IsOptional()
  @IsIn(NIVELES_SERIO_INTERES)
  serioInteres?: (typeof NIVELES_SERIO_INTERES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(MAX_TEXTO_LIBRE)
  paisesInteres?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_TEXTO_LIBRE)
  queTeHaFrenado?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_TEXTO_LIBRE)
  incertidumbre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_TEXTO_LIBRE)
  frustracionBusqueda?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_TEXTO_LIBRE)
  queHariaValerLaPena?: string;

  @IsOptional()
  @IsIn(NIVELES_CONSIDERARIA_PAGAR)
  consideraPagar?: (typeof NIVELES_CONSIDERARIA_PAGAR)[number];

  @IsOptional()
  @IsIn(RANGOS_PRECIO)
  precioJusto?: (typeof RANGOS_PRECIO)[number];

  @IsBoolean()
  completado!: boolean;
}

@Controller('historias')
export class HistoriasController {
  constructor(private readonly historias: HistoriaMedicoRepository) {}

  @Post()
  async registrar(@Body() dto: RegistrarHistoriaMedicoDto): Promise<{ ok: true }> {
    await this.historias.registrar(dto);
    return { ok: true };
  }
}
