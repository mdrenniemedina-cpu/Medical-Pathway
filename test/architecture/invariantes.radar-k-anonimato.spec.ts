import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { CohorteRepositoryPg } from '@contexts/radar-espera/infrastructure/cohorte.repository.pg';

dotenv.config();

/**
 * Invariante pedida explícitamente por el founder: "publicación de cohortes
 * que no cumplan el umbral de k-anonimato" debe ser imposible. Es una
 * prueba de INTEGRACIÓN real contra Postgres (no un mock) porque la
 * invariante vive tanto en la vista materializada (HAVING, ver
 * `db/migrations/0007_radar_espera.sql`) como en `CohorteRepositoryPg` — se
 * verifica el comportamiento end-to-end real, no solo la intención.
 * Requiere `DATABASE_URL` apuntando a una base con las migraciones
 * aplicadas (ver `npm run migrate`).
 */
describe('Invariante: cohortes por debajo del umbral de k-anonimato nunca se publican', () => {
  let pool: Pool;
  let repo: CohorteRepositoryPg;
  const destinoId = `destino-test-${nanoid(6)}`;
  const rutaId = `ruta-test-${nanoid(6)}`;
  const anio = 2031; // año futuro dedicado a este test, evita colisión con datos semilla/otros tests
  const trimestre = 1;

  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const config = { get: (key: string) => (key === 'RADAR_K_ANONIMATO_UMBRAL' ? 5 : undefined) } as unknown as ConfigService;
    repo = new CohorteRepositoryPg(pool, config);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM radar_espera.registro_expediente WHERE destino_id = $1', [destinoId]);
    await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY radar_espera.cohorte_comparacion');
    await pool.end();
  });

  async function insertarRegistros(cantidad: number): Promise<void> {
    for (let i = 0; i < cantidad; i++) {
      await pool.query(
        `INSERT INTO radar_espera.registro_expediente (
           id, perfil_id, destino_id, ruta_homologacion_id, ventana_envio_anio, ventana_envio_trimestre,
           resultado, fecha_resolucion, confianza_dato, marcado_anomalo, confirmado_por_usuario
         ) VALUES ($1,$2,$3,$4,$5,$6,'aprobado',$7,1,false,true)`,
        [nanoid(), nanoid(), destinoId, rutaId, anio, trimestre, new Date(anio, 6, 1)],
      );
    }
    await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY radar_espera.cohorte_comparacion');
  }

  it('devuelve disponible=false por debajo del umbral (3 registros, umbral=5)', async () => {
    await insertarRegistros(3);
    const resultado = await repo.consultar(destinoId, rutaId, anio, trimestre);
    expect(resultado.disponible).toBe(false);
    if (!resultado.disponible) {
      expect(resultado.mensaje).toBeTruthy();
      expect((resultado as unknown as { distribucion?: unknown }).distribucion).toBeUndefined();
    }
  });

  it('devuelve disponible=true con distribución al alcanzar el umbral (2 registros más = 5 total)', async () => {
    await insertarRegistros(2);
    const resultado = await repo.consultar(destinoId, rutaId, anio, trimestre);
    expect(resultado.disponible).toBe(true);
    if (resultado.disponible) {
      expect(resultado.nRegistros).toBeGreaterThanOrEqual(5);
      expect(resultado.distribucion.p50Dias).toBeGreaterThan(0);
    }
  });
});
