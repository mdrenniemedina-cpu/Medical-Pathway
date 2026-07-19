import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { CohorteRepositoryPort, ConsultaCohorte } from '../domain/cohorte.repository.port';

interface CohorteRow {
  n_registros_validos: string;
  p25_dias: string | null;
  p50_dias: string | null;
  p75_dias: string | null;
  p90_dias: string | null;
  proporcion_resuelta: string | null;
}

/**
 * Consulta la vista materializada `radar_espera.cohorte_comparacion` (ver
 * `06-database-schema.md`), que YA filtra por el umbral de k-anonimato en su
 * propio `HAVING`. Esta clase añade una segunda verificación explícita
 * (defensa en profundidad, igual que la RLS de `08-auth-model.md`): incluso
 * si la vista cambiara y dejara de filtrar, este código nunca devuelve una
 * distribución para un grupo por debajo del umbral configurado.
 */
@Injectable()
export class CohorteRepositoryPg implements CohorteRepositoryPort {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly config: ConfigService,
  ) {}

  async consultar(
    destinoId: string,
    rutaHomologacionId: string,
    anio: number,
    trimestre: number,
    region?: string,
  ): Promise<ConsultaCohorte> {
    const umbral = this.config.get<number>('RADAR_K_ANONIMATO_UMBRAL') ?? 5;
    const { rows } = await this.pool.query<CohorteRow>(
      `SELECT n_registros_validos, p25_dias, p50_dias, p75_dias, p90_dias, proporcion_resuelta
       FROM radar_espera.cohorte_comparacion
       WHERE destino_id = $1 AND ruta_homologacion_id = $2 AND ventana_envio_anio = $3 AND ventana_envio_trimestre = $4
         AND ($5::text IS NULL OR region = $5)`,
      [destinoId, rutaHomologacionId, anio, trimestre, region ?? null],
    );
    const row = rows[0];
    const n = row ? Number(row.n_registros_validos) : 0;

    if (!row || n < umbral) {
      return {
        disponible: false,
        nRegistros: n,
        mensaje: 'Aún no hay suficientes datos para tu grupo específico. Vuelve pronto.',
      };
    }

    return {
      disponible: true,
      nRegistros: n,
      distribucion: {
        p25Dias: Number(row.p25_dias ?? 0),
        p50Dias: Number(row.p50_dias ?? 0),
        p75Dias: Number(row.p75_dias ?? 0),
        p90Dias: Number(row.p90_dias ?? 0),
      },
      proporcionResuelta: Number(row.proporcion_resuelta ?? 0),
      nivelConfianzaEstimacion: n >= umbral * 4 ? 'alta' : n >= umbral * 2 ? 'media' : 'preliminar',
    };
  }
}
