CREATE SCHEMA IF NOT EXISTS radar_espera;

CREATE TABLE radar_espera.registro_expediente (
  id TEXT PRIMARY KEY,
  perfil_id TEXT NOT NULL,
  destino_id TEXT NOT NULL,
  ruta_homologacion_id TEXT NOT NULL,
  region TEXT,
  especialidad TEXT,
  ventana_envio_anio INT NOT NULL,
  ventana_envio_trimestre INT NOT NULL CHECK (ventana_envio_trimestre BETWEEN 1 AND 4),
  resultado TEXT NOT NULL DEFAULT 'pendiente' CHECK (resultado IN ('pendiente', 'aprobado', 'subsanacion', 'rechazado')),
  fecha_resolucion DATE,
  confianza_dato NUMERIC NOT NULL DEFAULT 0 CHECK (confianza_dato BETWEEN 0 AND 1),
  marcado_anomalo BOOLEAN NOT NULL DEFAULT false,
  -- Ver `05-domain-model-ddd.md` §8 y RutaMedicoAcl: un borrador pre-rellenado
  -- por el Anti-Corruption Layer no cuenta para agregados hasta que el
  -- propio usuario lo confirma (reciprocidad de datos, ADR-014).
  confirmado_por_usuario BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (perfil_id, destino_id, ruta_homologacion_id)
);

CREATE INDEX idx_registro_cohorte ON radar_espera.registro_expediente
  (destino_id, ruta_homologacion_id, ventana_envio_anio, ventana_envio_trimestre)
  WHERE confirmado_por_usuario = true AND marcado_anomalo = false;

-- Vista materializada de cohortes — ver `decisions/ADR-008`. La cláusula
-- HAVING aplica el umbral de k-anonimato a nivel de base de datos (defensa
-- en profundidad respecto al umbral que también verifica CohorteRepositoryPg
-- en la capa de aplicación). SOLO cuenta registros confirmados por el
-- usuario y no marcados como anómalos.
CREATE MATERIALIZED VIEW radar_espera.cohorte_comparacion AS
SELECT
  destino_id,
  ruta_homologacion_id,
  region,
  ventana_envio_anio,
  ventana_envio_trimestre,
  count(*) AS n_registros_validos,
  percentile_cont(0.25) WITHIN GROUP (
    ORDER BY (fecha_resolucion - make_date(ventana_envio_anio, (ventana_envio_trimestre - 1) * 3 + 1, 1))
  ) FILTER (WHERE resultado <> 'pendiente') AS p25_dias,
  percentile_cont(0.50) WITHIN GROUP (
    ORDER BY (fecha_resolucion - make_date(ventana_envio_anio, (ventana_envio_trimestre - 1) * 3 + 1, 1))
  ) FILTER (WHERE resultado <> 'pendiente') AS p50_dias,
  percentile_cont(0.75) WITHIN GROUP (
    ORDER BY (fecha_resolucion - make_date(ventana_envio_anio, (ventana_envio_trimestre - 1) * 3 + 1, 1))
  ) FILTER (WHERE resultado <> 'pendiente') AS p75_dias,
  percentile_cont(0.90) WITHIN GROUP (
    ORDER BY (fecha_resolucion - make_date(ventana_envio_anio, (ventana_envio_trimestre - 1) * 3 + 1, 1))
  ) FILTER (WHERE resultado <> 'pendiente') AS p90_dias,
  (count(*) FILTER (WHERE resultado <> 'pendiente'))::float / NULLIF(count(*), 0) AS proporcion_resuelta
FROM radar_espera.registro_expediente
WHERE confirmado_por_usuario = true AND marcado_anomalo = false
GROUP BY destino_id, ruta_homologacion_id, region, ventana_envio_anio, ventana_envio_trimestre
HAVING count(*) >= 5; -- umbral de k-anonimato por defecto; ajustable, ver RADAR_K_ANONIMATO_UMBRAL

-- REFRESH ... CONCURRENTLY exige un índice único que no use expresiones ni
-- sea parcial (PostgreSQL 14+) — por eso se indexa `region` directamente
-- (aunque sea NULL para destinos sin segmentación regional) en vez de
-- envolverla en coalesce().
CREATE UNIQUE INDEX idx_cohorte_comparacion_pk ON radar_espera.cohorte_comparacion
  (destino_id, ruta_homologacion_id, region, ventana_envio_anio, ventana_envio_trimestre);
