import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';
import { ResultadoRepositoryPort } from '../domain/descubrimiento.repository.port';
import { ResultadoDescubrimiento } from '../domain/resultado-descubrimiento.aggregate';
import { PuntuacionDestino } from '../domain/value-objects/puntuacion-destino.vo';
import { Razon } from '../domain/value-objects/razon.vo';

interface ResultadoRow {
  id: string;
  perfil_id: string;
  reglas_version: number;
  generado_en: Date;
  destino_seleccionado_id: string | null;
}
interface PuntuacionRow {
  id: string;
  destino_id: string;
  porcentaje_compatibilidad: string;
}
interface RazonRow {
  puntuacion_destino_id: string;
  criterio: string;
  aporte_puntos: string;
  explicacion_legible: string;
}

async function hidratar(pool: Pool, row: ResultadoRow): Promise<ResultadoDescubrimiento> {
  const { rows: puntuacionRows } = await pool.query<PuntuacionRow>(
    'SELECT id, destino_id, porcentaje_compatibilidad FROM descubrimiento.puntuacion_destino WHERE resultado_id = $1',
    [row.id],
  );
  const puntuaciones: PuntuacionDestino[] = [];
  for (const pRow of puntuacionRows) {
    const { rows: razonRows } = await pool.query<RazonRow>(
      'SELECT criterio, aporte_puntos, explicacion_legible FROM descubrimiento.razon WHERE puntuacion_destino_id = $1',
      [pRow.id],
    );
    const razones = razonRows.map((r) => Razon.crear(r.criterio, Number(r.aporte_puntos), r.explicacion_legible));
    puntuaciones.push(PuntuacionDestino.crear(pRow.destino_id, Number(pRow.porcentaje_compatibilidad), razones));
  }
  return ResultadoDescubrimiento.reconstituir({
    id: row.id,
    perfilId: row.perfil_id,
    reglasVersion: row.reglas_version,
    generadoEn: new Date(row.generado_en),
    puntuaciones,
    destinoSeleccionadoId: row.destino_seleccionado_id ?? undefined,
  });
}

@Injectable()
export class ResultadoRepositoryPg implements ResultadoRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(resultado: ResultadoDescubrimiento): Promise<void> {
    const events = resultado.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO descubrimiento.resultado_descubrimiento (id, perfil_id, generado_en, reglas_version)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [resultado.id, resultado.perfilId, resultado.generadoEn, resultado.reglasVersion],
      );
      if (resultado.destinoSeleccionadoId) {
        await client.query(
          `UPDATE descubrimiento.resultado_descubrimiento SET destino_seleccionado_id = $1 WHERE id = $2`,
          [resultado.destinoSeleccionadoId, resultado.id],
        );
      }
      for (const puntuacion of resultado.puntuaciones) {
        const puntuacionId = nanoid();
        await client.query(
          `INSERT INTO descubrimiento.puntuacion_destino (id, resultado_id, destino_id, porcentaje_compatibilidad)
           VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [puntuacionId, resultado.id, puntuacion.destinoId, puntuacion.porcentajeCompatibilidad],
        );
        for (const razon of puntuacion.razones) {
          await client.query(
            `INSERT INTO descubrimiento.razon (id, puntuacion_destino_id, criterio, aporte_puntos, explicacion_legible)
             VALUES ($1, $2, $3, $4, $5)`,
            [nanoid(), puntuacionId, razon.criterio, razon.aportePuntos, razon.explicacionLegible],
          );
        }
      }
      return { result: undefined, events };
    });
  }

  async buscarPorId(id: string): Promise<ResultadoDescubrimiento | null> {
    const { rows } = await this.pool.query<ResultadoRow>(
      'SELECT * FROM descubrimiento.resultado_descubrimiento WHERE id = $1',
      [id],
    );
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }
}
