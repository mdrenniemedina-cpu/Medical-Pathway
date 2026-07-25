-- Módulo privado de Academy (MVP de un solo curso, un solo estudiante) —
-- deliberadamente aislado del resto del dominio para poder reutilizarse si
-- en el futuro se construye una Academy completa. NO aparece en la
-- navegación pública; el acceso se habilita/deshabilita directamente aquí
-- (UPDATE manual), sin necesidad de una UI de administración.
CREATE SCHEMA IF NOT EXISTS academia_privada;

CREATE TABLE academia_privada.acceso_curso (
  id TEXT PRIMARY KEY,
  cuenta_id TEXT NOT NULL,
  curso_id TEXT NOT NULL DEFAULT 'reporte-caso',
  habilitado BOOLEAN NOT NULL DEFAULT true,
  fecha_expiracion TIMESTAMPTZ, -- NULL = sin expiración
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cuenta_id, curso_id)
);

-- Auditoría básica: cuándo un usuario visualizó cada recurso. Solo lectura,
-- sin ningún efecto sobre el acceso (no es control de uso, es bitácora).
CREATE TABLE academia_privada.recurso_visto (
  id TEXT PRIMARY KEY,
  cuenta_id TEXT NOT NULL,
  curso_id TEXT NOT NULL,
  recurso TEXT NOT NULL, -- 'video-1' | 'video-2' | 'video-3' | 'guia-care'
  visto_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_acceso_curso_cuenta ON academia_privada.acceso_curso (cuenta_id, curso_id);
CREATE INDEX idx_recurso_visto_cuenta ON academia_privada.recurso_visto (cuenta_id, curso_id, visto_en);
