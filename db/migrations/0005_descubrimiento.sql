CREATE SCHEMA IF NOT EXISTS descubrimiento;

CREATE TABLE descubrimiento.regla_compatibilidad (
  id TEXT PRIMARY KEY,
  atributo_perfil TEXT NOT NULL,
  atributo_destino TEXT NOT NULL,
  funcion_ajuste TEXT NOT NULL DEFAULT 'default',
  peso NUMERIC NOT NULL,
  version INT NOT NULL DEFAULT 1,
  activa BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE descubrimiento.resultado_descubrimiento (
  id TEXT PRIMARY KEY,
  perfil_id TEXT NOT NULL,
  generado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  reglas_version INT NOT NULL,
  destino_seleccionado_id TEXT
);

CREATE TABLE descubrimiento.puntuacion_destino (
  id TEXT PRIMARY KEY,
  resultado_id TEXT NOT NULL REFERENCES descubrimiento.resultado_descubrimiento(id) ON DELETE CASCADE,
  destino_id TEXT NOT NULL,
  porcentaje_compatibilidad NUMERIC NOT NULL CHECK (porcentaje_compatibilidad BETWEEN 0 AND 100)
);

CREATE TABLE descubrimiento.razon (
  id TEXT PRIMARY KEY,
  puntuacion_destino_id TEXT NOT NULL REFERENCES descubrimiento.puntuacion_destino(id) ON DELETE CASCADE,
  criterio TEXT NOT NULL,
  aporte_puntos NUMERIC NOT NULL,
  explicacion_legible TEXT NOT NULL
);

CREATE INDEX idx_resultado_perfil ON descubrimiento.resultado_descubrimiento (perfil_id);
CREATE INDEX idx_puntuacion_resultado ON descubrimiento.puntuacion_destino (resultado_id);
CREATE INDEX idx_razon_puntuacion ON descubrimiento.razon (puntuacion_destino_id);

-- Nota deliberada: la invariante "toda puntuación tiene al menos una razón"
-- se hace cumplir en `PuntuacionDestino.crear()` (dominio) y se persiste
-- siempre dentro de la misma transacción (ver ResultadoRepositoryPg) — no se
-- añade un trigger de base de datos adicional para esto en Sprint 0, para no
-- duplicar la misma regla en dos lenguajes distintos sin necesidad real
-- todavía (ver advertencia del founder sobre abstracciones vacías).
