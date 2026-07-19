CREATE SCHEMA IF NOT EXISTS ruta_medico;

CREATE TABLE ruta_medico.ruta_personalizada (
  id TEXT PRIMARY KEY,
  perfil_id TEXT NOT NULL,
  destino_id TEXT NOT NULL,
  ruta_homologacion_id TEXT NOT NULL,
  region TEXT,
  activa BOOLEAN NOT NULL DEFAULT true
);

-- Invariante de dominio: una ruta activa por perfil+destino (ver
-- `05-domain-model-ddd.md` §7). Índice único parcial en lugar de constraint
-- simple porque "activa" puede volver a false en el futuro sin violar la regla.
CREATE UNIQUE INDEX idx_una_ruta_activa_por_perfil_destino
  ON ruta_medico.ruta_personalizada (perfil_id, destino_id) WHERE activa = true;

CREATE TABLE ruta_medico.etapa_personalizada (
  id TEXT PRIMARY KEY,
  ruta_personalizada_id TEXT NOT NULL REFERENCES ruta_medico.ruta_personalizada(id) ON DELETE CASCADE,
  etapa_ruta_id TEXT NOT NULL,
  orden INT NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('documental', 'examen', 'espera', 'registro')),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_curso', 'completada', 'omitida')),
  obligatoria BOOLEAN NOT NULL DEFAULT true,
  fecha_inicio DATE,
  fecha_fin DATE,
  prerequisito_etapa_personalizada_id TEXT REFERENCES ruta_medico.etapa_personalizada(id)
);

CREATE TABLE ruta_medico.documento_asociado (
  id TEXT PRIMARY KEY,
  etapa_personalizada_id TEXT NOT NULL REFERENCES ruta_medico.etapa_personalizada(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  storage_ref_cifrada TEXT NOT NULL,
  fecha_carga TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_vencimiento DATE
);

CREATE INDEX idx_etapa_ruta_personalizada ON ruta_medico.etapa_personalizada (ruta_personalizada_id);
CREATE INDEX idx_documento_etapa ON ruta_medico.documento_asociado (etapa_personalizada_id);
