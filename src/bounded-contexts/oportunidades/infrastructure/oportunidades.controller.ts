import { Controller, Get } from '@nestjs/common';

/** Esqueleto deliberado (Sprint 0) — ver nota en `comunidad.controller.ts`. */
@Controller('oportunidades')
export class OportunidadesController {
  @Get('estado')
  estado(): { contexto: string; estado: string } {
    return { contexto: 'oportunidades', estado: 'esqueleto — lógica pendiente de sprint posterior' };
  }
}
