-- Instrumento de descubrimiento cualitativo ("Comparte tu historia"): recolecta
-- reflexiones de médicos/estudiantes sobre su interés en ejercer en el
-- extranjero. Deliberadamente NO es un bounded context (sin agregados, sin
-- invariantes de negocio) — es infraestructura de captura de evidencia,
-- igual que analitica.evento_producto (ver ADR-021). Público, sin cuenta
-- asociada: el formulario no requiere login (fricción mínima a propósito).
CREATE SCHEMA IF NOT EXISTS historias;

CREATE TABLE historias.historia_medico (
  id TEXT PRIMARY KEY,
  etapa_formacion TEXT NOT NULL CHECK (etapa_formacion IN (
    'estudiante', 'internado', 'servicio_social', 'medico_general', 'residente', 'especialista'
  )),
  ha_imaginado_ejercer_otro_pais BOOLEAN NOT NULL,
  serio_interes TEXT CHECK (serio_interes IN (
    'idea', 'lo_he_pensado_varias_veces', 'investigando_opciones', 'decidido', 'ya_inicie_proceso'
  )),
  paises_interes TEXT,
  que_te_ha_frenado TEXT,
  incertidumbre TEXT,
  frustracion_busqueda TEXT,
  que_haria_valer_la_pena TEXT,
  consideraria_pagar TEXT CHECK (consideraria_pagar IN ('si', 'tal_vez', 'no')),
  precio_justo TEXT CHECK (precio_justo IN (
    'menos_5', '5_10', '10_20', '20_30', '30_50', 'mas_50'
  )),
  completado BOOLEAN NOT NULL DEFAULT false,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_historia_medico_etapa ON historias.historia_medico (etapa_formacion);
CREATE INDEX idx_historia_medico_completado ON historias.historia_medico (completado);
