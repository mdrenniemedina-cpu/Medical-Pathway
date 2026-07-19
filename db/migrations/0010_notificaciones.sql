CREATE SCHEMA IF NOT EXISTS notificaciones;

CREATE TABLE notificaciones.preferencia (
  perfil_id TEXT PRIMARY KEY,
  canal_email BOOLEAN NOT NULL DEFAULT true,
  canal_push BOOLEAN NOT NULL DEFAULT true,
  frecuencia_maxima TEXT NOT NULL DEFAULT 'semanal'
);

CREATE TABLE notificaciones.alerta (
  id TEXT PRIMARY KEY,
  perfil_id TEXT NOT NULL,
  tipo_evento_origen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  enviada_en TIMESTAMPTZ,
  leida BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_alerta_perfil ON notificaciones.alerta (perfil_id);
