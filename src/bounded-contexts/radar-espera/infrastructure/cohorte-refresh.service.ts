import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Pool } from 'pg';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';

/**
 * Recalcula la vista materializada de cohortes de forma periódica y
 * asíncrona (nunca en el camino de una petición de usuario) — ver
 * `04-architecture.md` §7 y `11-riesgos-tecnicos-mitigacion.md` #6.
 * `CONCURRENTLY` evita bloquear lecturas mientras se recalcula (requiere el
 * índice único creado en la migración 0007).
 */
@Injectable()
export class CohorteRefreshService {
  private readonly logger = new Logger(CohorteRefreshService.name);
  private refrescando = false;

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Interval(60_000)
  async refrescar(): Promise<void> {
    if (this.refrescando) return;
    this.refrescando = true;
    try {
      await this.pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY radar_espera.cohorte_comparacion');
    } catch (error) {
      this.logger.error(`Fallo refrescando cohorte_comparacion: ${(error as Error).message}`);
    } finally {
      this.refrescando = false;
    }
  }
}
