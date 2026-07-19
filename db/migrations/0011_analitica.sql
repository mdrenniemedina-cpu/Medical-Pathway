-- Analítica de producto (Sprint 1): telemetría de interacción de UI +
-- eventos de dominio reales traducidos automáticamente. Deliberadamente NO
-- es un bounded context (sin agregados, sin invariantes de negocio) — es
-- infraestructura de reporte transversal, distinta del outbox de dominio
-- (shared.outbox_event) y de las alertas personalizadas
-- (notificaciones.alerta). Ver decisions/ADR-021.
CREATE SCHEMA IF NOT EXISTS analitica;

CREATE TABLE analitica.evento_producto (
  id TEXT PRIMARY KEY,
  tipo_evento TEXT NOT NULL,
  perfil_id TEXT,
  origen TEXT NOT NULL DEFAULT 'frontend', -- 'frontend' | 'dominio'
  propiedades JSONB NOT NULL DEFAULT '{}',
  ocurrido_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evento_producto_tipo ON analitica.evento_producto (tipo_evento, ocurrido_en);
CREATE INDEX idx_evento_producto_perfil ON analitica.evento_producto (perfil_id);
