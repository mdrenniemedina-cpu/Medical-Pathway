/**
 * Datos semilla mínimos para el Sprint 0: España (destino profundo, con
 * ruta de homologación completa incluyendo la etapa de espera que activa
 * el Radar) y Alemania (solo el radar de destinos, profundidad ligera,
 * ver `decisions/ADR-001`). Todas las cifras provienen de
 * `research/01-pathways-spain-germany-brazil.md` — cada campo lleva su
 * fuente y fecha de verificación real, nunca un placeholder.
 */
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');

    // --- Destinos ---
    await client.query(
      `INSERT INTO catalogo.destino (
         id, nombre, codigo_iso, idioma_requerido, nivel_idioma_requerido,
         tiempo_tipico_meses_valor, tiempo_tipico_meses_fuente_url, tiempo_tipico_meses_fecha_verificacion,
         coste_tipico_valor, coste_tipico_moneda, coste_tipico_fuente_url, coste_tipico_fecha_verificacion,
         nivel_demanda_valor, nivel_demanda_fuente_url, nivel_demanda_fecha_verificacion,
         dificultad_relativa_valor, dificultad_relativa_fuente_url, dificultad_relativa_fecha_verificacion,
         complejidad_regulatoria_valor, complejidad_regulatoria_fuente_url, complejidad_regulatoria_fecha_verificacion,
         locale_default
       ) VALUES
       ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       ON CONFLICT (id) DO NOTHING`,
      [
        'destino-espana', 'España', 'ES', null, null,
        15, 'https://www.sanidad.gob.es/areas/profesionesSanitarias/', '2026-07-19',
        166.50, 'EUR', 'https://abogadosinterlex.com/requisitos-colegiarse-como-medico-en-espana/', '2026-07-19',
        'muy_alta', 'https://www.sanidad.gob.es/areas/profesionesSanitarias/', '2026-07-19',
        'media', 'https://www.elespanol.com/invertia/observatorios/sanidad/', '2026-07-19',
        'media', 'https://www.ciencia.gob.es/Universidades/validate/homologacion/medico.html', '2026-07-19',
        'es',
      ],
    );

    await client.query(
      `INSERT INTO catalogo.destino (
         id, nombre, codigo_iso, idioma_requerido, nivel_idioma_requerido,
         tiempo_tipico_meses_valor, tiempo_tipico_meses_fuente_url, tiempo_tipico_meses_fecha_verificacion,
         coste_tipico_valor, coste_tipico_moneda, coste_tipico_fuente_url, coste_tipico_fecha_verificacion,
         nivel_demanda_valor, nivel_demanda_fuente_url, nivel_demanda_fecha_verificacion,
         dificultad_relativa_valor, dificultad_relativa_fuente_url, dificultad_relativa_fecha_verificacion,
         complejidad_regulatoria_valor, complejidad_regulatoria_fuente_url, complejidad_regulatoria_fecha_verificacion,
         locale_default
       ) VALUES
       ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       ON CONFLICT (id) DO NOTHING`,
      [
        'destino-alemania', 'Alemania', 'DE', 'aleman', 'B2/C1',
        18, 'https://kennti.com/approbation-dauer-zeitplan-auslaendische-aerzte-2026/', '2026-07-19',
        3000, 'EUR', 'https://www.nizza.niedersachsen.de/startseite/aktuelles/kosten-fachsprachprufung-und-kenntnispruefung-arzte-arztinnen-neu-246731.html', '2026-07-19',
        'muy_alta', 'https://aerztestellen.aerzteblatt.de/de/redaktion/deutschland-arbeiten-woher-kommen-auslaendische-aerzte', '2026-07-19',
        'alta', 'https://kennti.com/en/kenntnispruefung-medicine-in-germany-your-complete-guide-to-approbation/', '2026-07-19',
        'muy_alta', 'https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/AnerkennungBerufsabschluss/', '2026-07-19',
        'es',
      ],
    );

    // --- Ruta de homologación profunda: España ---
    await client.query(
      `INSERT INTO catalogo.ruta_homologacion (id, destino_id, nombre, publicada, version)
       VALUES ('ruta-espana-homologacion', 'destino-espana', 'Homologación de título médico en España', true, 1)
       ON CONFLICT (id) DO NOTHING`,
    );

    const etapasEspana: Array<[string, number, string, string, string, number, string, boolean]> = [
      ['etapa-es-apostilla', 1, 'Apostilla y legalización del título', 'documental',
        'https://abogadosinterlex.com/requisitos-colegiarse-como-medico-en-espana/', 30, '2026-07-19', false],
      ['etapa-es-traduccion', 2, 'Traducción jurada al español', 'documental',
        'https://abogadosinterlex.com/requisitos-colegiarse-como-medico-en-espana/', 15, '2026-07-19', false],
      ['etapa-es-solicitud', 3, 'Solicitud de homologación (Ministerio)', 'documental',
        'https://universidades.sede.gob.es/procedimientos/choose-ambit/idp/1029', 30, '2026-07-19', false],
      ['etapa-es-espera-resolucion', 4, 'Espera de resolución de homologación', 'espera',
        'https://www.gacetadesalud.com/profesionales/noticias/13883457/', 365, '2026-07-19', false],
      ['etapa-es-colegiacion', 5, 'Colegiación en el Colegio Oficial de Médicos', 'registro',
        'https://bookahospi.com/es/blog/colegiarse-medico-extranjero-espana-guia-paso-a-paso', 20, '2026-07-19', false],
      ['etapa-es-mir', 6, 'Examen MIR (opcional, para especialidad/plaza pública)', 'examen',
        'https://www.redaccionmedica.com/virico/noticias/-si-se-puede-trabajar-como-medico-sin-tener-que-enfrentarse-al-mir--5548', 180, '2026-07-19', true],
    ];

    let etapaAnteriorId: string | null = null;
    for (const [id, orden, nombre, tipo, fuente, dias, fecha, configurable] of etapasEspana) {
      await client.query(
        `INSERT INTO catalogo.etapa_ruta (
           id, ruta_id, orden, nombre, descripcion, tipo,
           duracion_tipica_valor, duracion_tipica_fuente_url, duracion_tipica_fecha_verificacion,
           es_configurable_por_perfil, prerequisito_etapa_id
         ) VALUES ($1,'ruta-espana-homologacion',$2,$3,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [id, orden, nombre, tipo, dias, fuente, fecha, configurable, etapaAnteriorId],
      );
      etapaAnteriorId = id;
    }

    // --- Reglas de compatibilidad (motor de Descubrimiento) ---
    const reglas: Array<[string, string, string, number]> = [
      ['regla-idioma', 'idiomas_dominados', 'idioma_requerido', 1.0],
      ['regla-demanda', 'objetivos', 'nivel_demanda', 1.0],
      ['regla-tiempo', 'objetivos', 'tiempo_tipico_meses', 1.0],
      ['regla-complejidad', 'objetivos', 'complejidad_regulatoria', 1.0],
    ];
    for (const [id, atributoPerfil, atributoDestino, peso] of reglas) {
      await client.query(
        `INSERT INTO descubrimiento.regla_compatibilidad (id, atributo_perfil, atributo_destino, peso, version, activa)
         VALUES ($1, $2, $3, $4, 1, true)
         ON CONFLICT (id) DO NOTHING`,
        [id, atributoPerfil, atributoDestino, peso],
      );
    }

    await client.query('COMMIT');
    console.log('Semilla aplicada: destinos (España, Alemania), ruta de homologación de España, reglas de compatibilidad.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

void seed();
