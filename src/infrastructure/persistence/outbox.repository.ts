import { PoolClient } from 'pg';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';

export async function writeOutboxEvents(client: PoolClient, events: DomainEvent[]): Promise<void> {
  for (const event of events) {
    await client.query(
      `INSERT INTO shared.outbox_event (event_name, aggregate_id, payload, occurred_at)
       VALUES ($1, $2, $3, $4)`,
      [event.eventName, event.aggregateId, JSON.stringify(event.payload), event.occurredAt],
    );
  }
}

export interface OutboxRow {
  id: string;
  event_name: string;
  aggregate_id: string;
  payload: Record<string, unknown>;
  occurred_at: Date;
}

export async function fetchUnpublishedOutboxEvents(client: PoolClient, limit = 50): Promise<OutboxRow[]> {
  const { rows } = await client.query<OutboxRow>(
    `SELECT id, event_name, aggregate_id, payload, occurred_at
     FROM shared.outbox_event
     WHERE published_at IS NULL
     ORDER BY occurred_at ASC
     LIMIT $1
     FOR UPDATE SKIP LOCKED`,
    [limit],
  );
  return rows;
}

export async function markOutboxEventPublished(client: PoolClient, id: string): Promise<void> {
  await client.query(`UPDATE shared.outbox_event SET published_at = now() WHERE id = $1`, [id]);
}
