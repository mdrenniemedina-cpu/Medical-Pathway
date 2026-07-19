import { Controller, Get } from '@nestjs/common';

/** Esqueleto deliberado (Sprint 0) — ver nota en `comunidad.controller.ts`. */
@Controller('notificaciones')
export class NotificacionesController {
  @Get('estado')
  estado(): { contexto: string; estado: string } {
    return { contexto: 'notificaciones', estado: 'esqueleto — suscriptor genérico activo, CRUD de preferencias pendiente' };
  }
}
