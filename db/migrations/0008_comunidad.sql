CREATE SCHEMA IF NOT EXISTS comunidad;

CREATE TABLE comunidad.hilo (
  id TEXT PRIMARY KEY,
  autor_perfil_id TEXT NOT NULL,
  destino_id TEXT,
  ventana_envio_anio INT,
  ventana_envio_trimestre INT,
  titulo TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  moderado BOOLEAN NOT NULL DEFAULT false,
  reportado_como_estafa BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comunidad.respuesta (
  id TEXT PRIMARY KEY,
  hilo_id TEXT NOT NULL REFERENCES comunidad.hilo(id) ON DELETE CASCADE,
  autor_perfil_id TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  es_mentor_verificado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comunidad.reputacion (
  perfil_id TEXT PRIMARY KEY,
  puntaje NUMERIC NOT NULL DEFAULT 0,
  respuestas_utiles_count INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_respuesta_hilo ON comunidad.respuesta (hilo_id);
