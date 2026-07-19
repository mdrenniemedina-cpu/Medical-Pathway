-- Outbox transaccional (ADR-015): compartido por todos los bounded contexts.
-- No pertenece a ningún contexto de negocio — es infraestructura pura.
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para gen_random_uuid()

CREATE SCHEMA IF NOT EXISTS shared;

CREATE TABLE IF NOT EXISTS shared.outbox_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_event_unpublished ON shared.outbox_event (occurred_at) WHERE published_at IS NULL;
