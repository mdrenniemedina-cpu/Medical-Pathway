CREATE SCHEMA IF NOT EXISTS perfil;

CREATE TABLE perfil.perfil_internacional (
  id TEXT PRIMARY KEY,
  cuenta_id TEXT NOT NULL UNIQUE,
  nivel_verificacion TEXT NOT NULL DEFAULT 'ninguno',
  presupuesto_rango TEXT,
  presupuesto_moneda TEXT,
  urgencia TEXT,
  tolerancia_examen_competitivo TEXT,
  prioridad_ingreso_vs_rapidez TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE perfil.formacion_academica (
  id TEXT PRIMARY KEY,
  perfil_id TEXT NOT NULL REFERENCES perfil.perfil_internacional(id) ON DELETE CASCADE,
  universidad TEXT NOT NULL,
  pais_graduacion TEXT NOT NULL,
  anio_graduacion INT,
  tipo_titulo TEXT NOT NULL,
  especialidad TEXT
);

CREATE TABLE perfil.competencia_idiomatica (
  id TEXT PRIMARY KEY,
  perfil_id TEXT NOT NULL REFERENCES perfil.perfil_internacional(id) ON DELETE CASCADE,
  idioma TEXT NOT NULL,
  nivel TEXT NOT NULL
);

CREATE INDEX idx_formacion_perfil ON perfil.formacion_academica (perfil_id);
CREATE INDEX idx_idioma_perfil ON perfil.competencia_idiomatica (perfil_id);
