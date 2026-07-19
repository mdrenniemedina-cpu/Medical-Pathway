CREATE SCHEMA IF NOT EXISTS identidad;

CREATE TABLE identidad.cuenta (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  proveedor_sso TEXT,
  rol TEXT NOT NULL DEFAULT 'usuario',
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identidad.sesion (
  id TEXT PRIMARY KEY,
  cuenta_id TEXT NOT NULL REFERENCES identidad.cuenta(id),
  refresh_token_hash TEXT NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  revocada BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_sesion_cuenta ON identidad.sesion (cuenta_id);
