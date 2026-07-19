import { Controller, Get } from '@nestjs/common';

/**
 * Esqueleto deliberado (Sprint 0): el contexto Comunidad está mapeado en el
 * dominio (`05-domain-model-ddd.md` §9: HiloDeComunidad, RespuestaDeComunidad,
 * ReputacionDeComunidad) y su schema de base de datos existe
 * (`06-database-schema.md`), pero su lógica de aplicación se construye en un
 * sprint posterior — no es deuda técnica, es alcance (ver
 * `03-mvp-definition.md`: la columna vertebral de los sprints 1-8 prioriza
 * Perfil→Descubrimiento→Ruta del Médico→Radar de Espera).
 */
@Controller('comunidad')
export class ComunidadController {
  @Get('estado')
  estado(): { contexto: string; estado: string } {
    return { contexto: 'comunidad', estado: 'esqueleto — lógica pendiente de sprint posterior' };
  }
}
