import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Pool } from 'pg';
import { PG_POOL } from '../persistence/pg-pool.provider';
import { fetchUnpublishedOutboxEvents, markOutboxEventPublished } from '../persistence/outbox.repository';
import { EVENT_BUS, EventBusPort } from '@shared-kernel/application/event-bus.port';
import { GenericIntegrationEvent } from './generic-integration-event';

/**
 * Sondea `shared.outbox_event` y publica al bus in-process los eventos aún no
 * despachados. Desacopla "persistir el cambio" (transaccional, síncrono) de
 * "notificar a otros contextos" (asíncrono, tolerante a reintentos) — ver
 * ADR-015. El intervalo de sondeo es deliberadamente corto en esta etapa
 * (bajo volumen); si el volumen crece, esta es la primera pieza candidata a
 * moverse a un mecanismo push (LISTEN/NOTIFY de Postgres) sin cambiar el
 * contrato de `EventBusPort` que consumen los bounded contexts.
 */
@Injectable()
export class OutboxDispatcherService {
  private readonly logger = new Logger(OutboxDispatcherService.name);
  private dispatching = false;

  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
  ) {}

  @Interval(2000)
  async dispatchPendingEvents(): Promise<void> {
    if (this.dispatching) return; // evita solapar corridas si una tarda más que el intervalo
    this.dispatching = true;
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const rows = await fetchUnpublishedOutboxEvents(client);
      for (const row of rows) {
        await this.eventBus.publish(new GenericIntegrationEvent(row.event_name, row.aggregate_id, row.payload));
        await markOutboxEventPublished(client, row.id);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error(`Fallo despachando outbox: ${(error as Error).message}`);
    } finally {
      client.release();
      this.dispatching = false;
    }
  }
}
