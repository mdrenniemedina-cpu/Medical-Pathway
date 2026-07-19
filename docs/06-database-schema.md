# Esquema de base de datos

> Se deriva directamente de `05-domain-model-ddd.md`. PostgreSQL, con **un schema de Postgres por bounded context** (namespacing lógico) — refuerza a nivel de almacenamiento los límites que DDD define a nivel de código: ningún módulo hace `JOIN` directo contra tablas de otro schema; la integración cruza siempre por eventos de dominio o por una vista/API publicada explícitamente.

## Convenciones

- Claves primarias: `UUID` (evita fugas de volumen de negocio vía IDs secuenciales, y facilita fusión eventual si un contexto se extrae a un servicio propio).
- Toda tabla de contenido editorial (`catalogo.*`) incluye `fuente_url` y `fecha_verificacion` en cada campo de hecho relevante — nunca opcional.
- Timestamps `created_at`/`updated_at` en todas las tablas (omitidos abajo por brevedad salvo cuando son relevantes al dominio).
- Los agregados de Radar de Espera nunca exponen `usuario_id` en las vistas de cohortes — solo en la tabla base, con acceso restringido (ver `08-auth-model.md`).

## Schema `identidad`

```sql
CREATE TABLE identidad.cuenta (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,               -- null si es SSO
  proveedor_sso TEXT,                -- 'google', null si es password
  rol TEXT NOT NULL DEFAULT 'usuario', -- usuario | mentor | moderador | editor_contenido | admin
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identidad.sesion (
  id UUID PRIMARY KEY,
  cuenta_id UUID NOT NULL REFERENCES identidad.cuenta(id),
  refresh_token_hash TEXT NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  revocada BOOLEAN NOT NULL DEFAULT false
);
```

## Schema `perfil`

```sql
CREATE TABLE perfil.perfil_internacional (
  id UUID PRIMARY KEY,
  cuenta_id UUID NOT NULL UNIQUE REFERENCES identidad.cuenta(id),
  nivel_verificacion TEXT NOT NULL DEFAULT 'ninguno', -- ninguno | correo_verificado | titulo_verificado
  presupuesto_rango TEXT,             -- value object aplanado
  presupuesto_moneda TEXT,
  urgencia TEXT,                      -- 'alta' | 'media' | 'baja'
  tolerancia_examen_competitivo TEXT, -- 'prefiere_rapido_competitivo' | 'prefiere_lento_seguro'
  prioridad_ingreso_vs_rapidez TEXT,
  movilidad_familiar TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE perfil.formacion_academica (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL REFERENCES perfil.perfil_internacional(id) ON DELETE CASCADE,
  universidad TEXT NOT NULL,
  pais_graduacion TEXT NOT NULL,
  anio_graduacion INT,
  tipo_titulo TEXT NOT NULL,          -- 'pregrado' | 'especialidad' | 'subespecialidad'
  especialidad TEXT
);

CREATE TABLE perfil.competencia_idiomatica (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL REFERENCES perfil.perfil_internacional(id) ON DELETE CASCADE,
  idioma TEXT NOT NULL,
  nivel TEXT NOT NULL                 -- A1..C2
);

CREATE TABLE perfil.experiencia_profesional (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL REFERENCES perfil.perfil_internacional(id) ON DELETE CASCADE,
  anios_experiencia INT,
  numero_publicaciones INT DEFAULT 0,
  cargos_previos TEXT[]
);
```

## Schema `catalogo` (contenido editorial)

```sql
CREATE TABLE catalogo.destino (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo_iso TEXT NOT NULL UNIQUE,
  idioma_requerido TEXT,               -- null si no hay barrera (España)
  nivel_idioma_requerido TEXT,         -- p.ej. 'B2', 'C1'
  tiempo_tipico_meses_valor INT,       tiempo_tipico_meses_fuente_url TEXT, tiempo_tipico_meses_fecha_verificacion DATE,
  coste_tipico_valor NUMERIC,          coste_tipico_moneda TEXT, coste_tipico_fuente_url TEXT, coste_tipico_fecha_verificacion DATE,
  nivel_demanda_valor TEXT,             nivel_demanda_fuente_url TEXT, nivel_demanda_fecha_verificacion DATE,
  dificultad_relativa_valor TEXT,       dificultad_relativa_fuente_url TEXT, dificultad_relativa_fecha_verificacion DATE,
  complejidad_regulatoria_valor TEXT,   complejidad_regulatoria_fuente_url TEXT, complejidad_regulatoria_fecha_verificacion DATE,
  locale_default TEXT NOT NULL DEFAULT 'es'   -- preparado para i18n futuro, ver 12-estrategia-escalamiento
);

CREATE TABLE catalogo.ruta_homologacion (
  id UUID PRIMARY KEY,
  destino_id UUID NOT NULL REFERENCES catalogo.destino(id),
  nombre TEXT NOT NULL,
  publicada BOOLEAN NOT NULL DEFAULT false,
  version INT NOT NULL DEFAULT 1
);

CREATE TABLE catalogo.etapa_ruta (
  id UUID PRIMARY KEY,
  ruta_id UUID NOT NULL REFERENCES catalogo.ruta_homologacion(id) ON DELETE CASCADE,
  orden INT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  tipo TEXT NOT NULL,                  -- 'documental' | 'examen' | 'espera' | 'registro'
  duracion_tipica_valor INT,            duracion_tipica_fuente_url TEXT NOT NULL, duracion_tipica_fecha_verificacion DATE NOT NULL,
  es_configurable_por_perfil BOOLEAN NOT NULL DEFAULT false,
  prerequisito_etapa_id UUID REFERENCES catalogo.etapa_ruta(id)
);
-- constraint a nivel de aplicación (no solo DB): no se permite publicada=true si alguna etapa_ruta carece de fuente
```

## Schema `descubrimiento`

```sql
CREATE TABLE descubrimiento.regla_compatibilidad (
  id UUID PRIMARY KEY,
  atributo_perfil TEXT NOT NULL,
  atributo_destino TEXT NOT NULL,
  funcion_ajuste TEXT NOT NULL,        -- identificador de función pura versionada en código
  peso NUMERIC NOT NULL,
  version INT NOT NULL DEFAULT 1,
  activa BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE descubrimiento.resultado_descubrimiento (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL,             -- referencia lógica a perfil.perfil_internacional, sin FK cruzando schemas
  generado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  reglas_version INT NOT NULL          -- para poder explicar resultados pasados aunque las reglas cambien
);

CREATE TABLE descubrimiento.puntuacion_destino (
  id UUID PRIMARY KEY,
  resultado_id UUID NOT NULL REFERENCES descubrimiento.resultado_descubrimiento(id) ON DELETE CASCADE,
  destino_id UUID NOT NULL,
  porcentaje_compatibilidad NUMERIC NOT NULL CHECK (porcentaje_compatibilidad BETWEEN 0 AND 100)
);

CREATE TABLE descubrimiento.razon (
  id UUID PRIMARY KEY,
  puntuacion_destino_id UUID NOT NULL REFERENCES descubrimiento.puntuacion_destino(id) ON DELETE CASCADE,
  criterio TEXT NOT NULL,
  aporte_puntos NUMERIC NOT NULL,
  explicacion_legible TEXT NOT NULL
);
-- invariante de aplicación: no se inserta puntuacion_destino sin al menos una fila en razon (transacción atómica)
```

## Schema `ruta_medico`

```sql
CREATE TABLE ruta_medico.ruta_personalizada (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL,
  destino_id UUID NOT NULL,
  ruta_homologacion_id UUID NOT NULL,  -- plantilla origen
  activa BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (perfil_id, destino_id, activa) DEFERRABLE INITIALLY IMMEDIATE  -- un plan activo por perfil+destino
);

CREATE TABLE ruta_medico.etapa_personalizada (
  id UUID PRIMARY KEY,
  ruta_personalizada_id UUID NOT NULL REFERENCES ruta_medico.ruta_personalizada(id) ON DELETE CASCADE,
  etapa_ruta_id UUID NOT NULL,          -- origen en catálogo, informativo
  orden INT NOT NULL,
  tipo TEXT NOT NULL,                   -- copiado de la plantilla al instanciar
  estado TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | en_curso | completada | omitida
  obligatoria BOOLEAN NOT NULL DEFAULT true, -- puede pasar a false al personalizar (p.ej. MIR opcional)
  fecha_inicio DATE,
  fecha_fin DATE,
  prerequisito_etapa_personalizada_id UUID REFERENCES ruta_medico.etapa_personalizada(id)
);

CREATE TABLE ruta_medico.documento_asociado (
  id UUID PRIMARY KEY,
  etapa_personalizada_id UUID NOT NULL REFERENCES ruta_medico.etapa_personalizada(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  storage_ref_cifrada TEXT NOT NULL,
  fecha_carga TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_vencimiento DATE
);
```

## Schema `radar_espera`

```sql
CREATE TABLE radar_espera.registro_expediente (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL,
  destino_id UUID NOT NULL,
  ruta_homologacion_id UUID NOT NULL,
  region TEXT,                          -- p.ej. comunidad autónoma
  especialidad TEXT,
  ventana_envio_anio INT NOT NULL,
  ventana_envio_trimestre INT NOT NULL, -- granularidad deliberada, no fecha exacta
  resultado TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | aprobado | subsanacion | rechazado
  fecha_resolucion DATE,
  confianza_dato NUMERIC NOT NULL DEFAULT 0.5 CHECK (confianza_dato BETWEEN 0 AND 1),
  marcado_anomalo BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (perfil_id, destino_id, ruta_homologacion_id)  -- un registro activo por combinación
);

-- Vista materializada, recalculada periódicamente (job en background), NUNCA expone perfil_id
CREATE MATERIALIZED VIEW radar_espera.cohorte_comparacion AS
SELECT
  destino_id, ruta_homologacion_id, region, ventana_envio_anio, ventana_envio_trimestre,
  count(*) FILTER (WHERE marcado_anomalo = false) AS n_registros_validos,
  percentile_cont(0.25) WITHIN GROUP (ORDER BY (fecha_resolucion - make_date(ventana_envio_anio,1,1))) FILTER (WHERE resultado <> 'pendiente') AS p25_dias,
  percentile_cont(0.50) WITHIN GROUP (ORDER BY (fecha_resolucion - make_date(ventana_envio_anio,1,1))) FILTER (WHERE resultado <> 'pendiente') AS p50_dias,
  percentile_cont(0.75) WITHIN GROUP (ORDER BY (fecha_resolucion - make_date(ventana_envio_anio,1,1))) FILTER (WHERE resultado <> 'pendiente') AS p75_dias,
  percentile_cont(0.90) WITHIN GROUP (ORDER BY (fecha_resolucion - make_date(ventana_envio_anio,1,1))) FILTER (WHERE resultado <> 'pendiente') AS p90_dias,
  (count(*) FILTER (WHERE resultado <> 'pendiente'))::float / NULLIF(count(*), 0) AS proporcion_resuelta
FROM radar_espera.registro_expediente
WHERE marcado_anomalo = false
GROUP BY destino_id, ruta_homologacion_id, region, ventana_envio_anio, ventana_envio_trimestre
HAVING count(*) FILTER (WHERE marcado_anomalo = false) >= 5;  -- umbral de k-anonimato (ADR-008), configurable
```

La agregación **pondera implícitamente por `confianza_dato`** en una versión posterior (percentil ponderado); en el MVP, el filtro `marcado_anomalo = false` ya excluye los registros de baja confianza detectados como anómalos (ver `13-calidad-confianza-datos-radar.md` para la evolución de esta ponderación).

## Schema `comunidad`

```sql
CREATE TABLE comunidad.hilo (
  id UUID PRIMARY KEY,
  autor_perfil_id UUID NOT NULL,
  destino_id UUID,
  ventana_envio_anio INT,               -- para segmentar hilos de espera de España
  ventana_envio_trimestre INT,
  titulo TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  moderado BOOLEAN NOT NULL DEFAULT false,
  reportado_como_estafa BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE comunidad.respuesta (
  id UUID PRIMARY KEY,
  hilo_id UUID NOT NULL REFERENCES comunidad.hilo(id) ON DELETE CASCADE,
  autor_perfil_id UUID NOT NULL,
  cuerpo TEXT NOT NULL,
  es_mentor_verificado BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE comunidad.reputacion (
  perfil_id UUID PRIMARY KEY,
  puntaje NUMERIC NOT NULL DEFAULT 0,
  respuestas_utiles_count INT NOT NULL DEFAULT 0
);
```

## Schema `oportunidades`

```sql
CREATE TABLE oportunidades.proveedor (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,             -- 'academia' | 'traductor' | 'gestor' | 'agencia_reclutamiento'
  destino_id UUID,
  estado_vetting TEXT NOT NULL DEFAULT 'no_revisado' -- no_revisado | verificado | reportado_fraudulento
);

CREATE TABLE oportunidades.oportunidad (
  id UUID PRIMARY KEY,
  destino_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  proveedor_id UUID REFERENCES oportunidades.proveedor(id)
);
```

## Schema `notificaciones`

```sql
CREATE TABLE notificaciones.preferencia (
  perfil_id UUID PRIMARY KEY,
  canal_email BOOLEAN NOT NULL DEFAULT true,
  canal_push BOOLEAN NOT NULL DEFAULT true,
  frecuencia_maxima TEXT NOT NULL DEFAULT 'semanal'
);

CREATE TABLE notificaciones.alerta (
  id UUID PRIMARY KEY,
  perfil_id UUID NOT NULL,
  tipo_evento_origen TEXT NOT NULL,     -- 'RutaHomologacionActualizada' | 'CohorteRecalculada' | etc.
  contenido TEXT NOT NULL,
  enviada_en TIMESTAMPTZ,
  leida BOOLEAN NOT NULL DEFAULT false
);
```

## Notas de diseño

- **Sin foreign keys entre schemas** (p. ej. `descubrimiento.puntuacion_destino.destino_id` no tiene `REFERENCES catalogo.destino(id)` a nivel de motor): es deliberado — refuerza que la integridad referencial cruzada se resuelve a nivel de aplicación/evento, no de base de datos, preservando el desacoplamiento de bounded contexts incluso en un monolito con una sola base de datos física.
- **`radar_espera.cohorte_comparacion` es la única superficie de lectura pública del contexto Radar** — ninguna vista ni endpoint expone `registro_expediente` fuera de su propio dueño.
- Ver `08-auth-model.md` para el control de acceso a nivel de fila (RLS) que refuerza estas reglas también en la base de datos, no solo en la capa de aplicación.
