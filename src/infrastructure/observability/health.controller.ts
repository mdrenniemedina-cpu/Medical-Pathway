import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../persistence/pg-pool.provider';

/**
 * Health check mínimo: proceso vivo + conectividad real a la base de datos.
 * No valida cada bounded context individualmente en el Sprint 0 (se
 * ampliaría por-contexto solo si un contexto tuviera una dependencia externa
 * propia, p.ej. un proveedor de email en Notificaciones).
 */
@Controller('health')
export class HealthController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Get()
  async check(): Promise<{ status: string; database: string }> {
    try {
      await this.pool.query('SELECT 1');
      return { status: 'ok', database: 'ok' };
    } catch {
      return { status: 'degraded', database: 'unreachable' };
    }
  }
}
