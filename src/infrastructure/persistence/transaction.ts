import { Pool, PoolClient } from 'pg';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { writeOutboxEvents } from './outbox.repository';

/**
 * Ejecuta `work` dentro de una transacción y, si `work` devuelve eventos de
 * dominio (vía `aggregate.pullDomainEvents()`), los escribe en la tabla
 * `shared.outbox_event` **en la misma transacción** antes de hacer commit.
 * Esto es el patrón Outbox transaccional (ADR-015): o se persiste el cambio
 * de estado del agregado y sus eventos juntos, o no se persiste ninguno de
 * los dos — nunca se pierde un evento por un fallo entre "guardar" y
 * "publicar".
 */
export async function runInTransactionWithOutbox<T>(
  pool: Pool,
  work: (client: PoolClient) => Promise<{ result: T; events: DomainEvent[] }>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { result, events } = await work(client);
    if (events.length > 0) {
      await writeOutboxEvents(client, events);
    }
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
