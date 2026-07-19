CREATE SCHEMA IF NOT EXISTS catalogo;

CREATE TABLE catalogo.destino (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo_iso TEXT NOT NULL UNIQUE,
  idioma_requerido TEXT,
  nivel_idioma_requerido TEXT,
  tiempo_tipico_meses_valor INT NOT NULL,
  tiempo_tipico_meses_fuente_url TEXT NOT NULL,
  tiempo_tipico_meses_fecha_verificacion DATE NOT NULL,
  coste_tipico_valor NUMERIC NOT NULL,
  coste_tipico_moneda TEXT NOT NULL,
  coste_tipico_fuente_url TEXT NOT NULL,
  coste_tipico_fecha_verificacion DATE NOT NULL,
  nivel_demanda_valor TEXT NOT NULL,
  nivel_demanda_fuente_url TEXT NOT NULL,
  nivel_demanda_fecha_verificacion DATE NOT NULL,
  dificultad_relativa_valor TEXT NOT NULL,
  dificultad_relativa_fuente_url TEXT NOT NULL,
  dificultad_relativa_fecha_verificacion DATE NOT NULL,
  complejidad_regulatoria_valor TEXT NOT NULL,
  complejidad_regulatoria_fuente_url TEXT NOT NULL,
  complejidad_regulatoria_fecha_verificacion DATE NOT NULL,
  locale_default TEXT NOT NULL DEFAULT 'es'
);

CREATE TABLE catalogo.ruta_homologacion (
  id TEXT PRIMARY KEY,
  destino_id TEXT NOT NULL REFERENCES catalogo.destino(id),
  nombre TEXT NOT NULL,
  publicada BOOLEAN NOT NULL DEFAULT false,
  version INT NOT NULL DEFAULT 1
);

CREATE TABLE catalogo.etapa_ruta (
  id TEXT PRIMARY KEY,
  ruta_id TEXT NOT NULL REFERENCES catalogo.ruta_homologacion(id) ON DELETE CASCADE,
  orden INT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('documental', 'examen', 'espera', 'registro')),
  duracion_tipica_valor INT NOT NULL,
  duracion_tipica_fuente_url TEXT NOT NULL,
  duracion_tipica_fecha_verificacion DATE NOT NULL,
  es_configurable_por_perfil BOOLEAN NOT NULL DEFAULT false,
  prerequisito_etapa_id TEXT REFERENCES catalogo.etapa_ruta(id)
);

CREATE INDEX idx_ruta_destino ON catalogo.ruta_homologacion (destino_id);
CREATE INDEX idx_etapa_ruta ON catalogo.etapa_ruta (ruta_id);

-- Índice único parcial: solo puede haber UNA ruta publicada por destino a la vez
-- (la instanciación de Ruta del Médico siempre toma "la" ruta publicada vigente).
CREATE UNIQUE INDEX idx_una_ruta_publicada_por_destino ON catalogo.ruta_homologacion (destino_id) WHERE publicada = true;
