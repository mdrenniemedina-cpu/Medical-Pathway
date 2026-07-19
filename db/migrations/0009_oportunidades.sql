CREATE SCHEMA IF NOT EXISTS oportunidades;

CREATE TABLE oportunidades.proveedor (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('academia', 'traductor', 'gestor', 'agencia_reclutamiento')),
  destino_id TEXT,
  estado_vetting TEXT NOT NULL DEFAULT 'no_revisado' CHECK (estado_vetting IN ('no_revisado', 'verificado', 'reportado_fraudulento'))
);

CREATE TABLE oportunidades.oportunidad (
  id TEXT PRIMARY KEY,
  destino_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  proveedor_id TEXT REFERENCES oportunidades.proveedor(id)
);
