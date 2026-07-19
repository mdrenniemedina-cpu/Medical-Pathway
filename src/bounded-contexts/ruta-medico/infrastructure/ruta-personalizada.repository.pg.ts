import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';
import { RutaPersonalizadaRepositoryPort } from '../domain/ruta-personalizada.repository.port';
import { RutaPersonalizada } from '../domain/ruta-personalizada.aggregate';
import { EtapaPersonalizada, EstadoEtapa, TipoEtapaPersonalizada } from '../domain/etapa-personalizada.entity';

interface RutaRow {
  id: string;
  perfil_id: string;
  destino_id: string;
  ruta_homologacion_id: string;
  region: string | null;
  activa: boolean;
}
interface EtapaRow {
  id: string;
  etapa_ruta_id: string;
  orden: number;
  nombre: string;
  tipo: TipoEtapaPersonalizada;
  estado: EstadoEtapa;
  obligatoria: boolean;
  prerequisito_etapa_personalizada_id: string | null;
}

async function hidratar(pool: Pool, row: RutaRow): Promise<RutaPersonalizada> {
  const { rows: etapaRows } = await pool.query<EtapaRow>(
    'SELECT * FROM ruta_medico.etapa_personalizada WHERE ruta_personalizada_id = $1 ORDER BY orden',
    [row.id],
  );
  const etapas = etapaRows.map((e) =>
    EtapaPersonalizada.crear({
      id: e.id,
      etapaRutaId: e.etapa_ruta_id,
      orden: e.orden,
      nombre: e.nombre,
      tipo: e.tipo,
      estado: e.estado,
      obligatoria: e.obligatoria,
      prerequisitoEtapaPersonalizadaId: e.prerequisito_etapa_personalizada_id ?? undefined,
      documentos: [],
    }),
  );
  return RutaPersonalizada.reconstituir({
    id: row.id,
    perfilId: row.perfil_id,
    destinoId: row.destino_id,
    rutaHomologacionId: row.ruta_homologacion_id,
    region: row.region ?? undefined,
    activa: row.activa,
    etapas,
  });
}

@Injectable()
export class RutaPersonalizadaRepositoryPg implements RutaPersonalizadaRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(ruta: RutaPersonalizada): Promise<void> {
    const events = ruta.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ruta_medico.ruta_personalizada (id, perfil_id, destino_id, ruta_homologacion_id, activa)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET activa = EXCLUDED.activa`,
        [ruta.id, ruta.perfilId, ruta.destinoId, ruta.rutaHomologacionId, true],
      );
      for (const etapa of ruta.etapas) {
        await client.query(
          `INSERT INTO ruta_medico.etapa_personalizada (id, ruta_personalizada_id, etapa_ruta_id, orden, nombre, tipo, estado, obligatoria, prerequisito_etapa_personalizada_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (id) DO UPDATE SET estado = EXCLUDED.estado`,
          [
            etapa.id || nanoid(),
            ruta.id,
            etapa.etapaRutaId,
            etapa.orden,
            etapa.nombre,
            etapa.tipo,
            etapa.estado,
            etapa.obligatoria,
            etapa.prerequisitoEtapaPersonalizadaId ?? null,
          ],
        );
      }
      return { result: undefined, events };
    });
  }

  async buscarActivaPorPerfilYDestino(perfilId: string, destinoId: string): Promise<RutaPersonalizada | null> {
    const { rows } = await this.pool.query<RutaRow>(
      'SELECT * FROM ruta_medico.ruta_personalizada WHERE perfil_id = $1 AND destino_id = $2 AND activa = true',
      [perfilId, destinoId],
    );
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }

  async buscarPorId(id: string): Promise<RutaPersonalizada | null> {
    const { rows } = await this.pool.query<RutaRow>('SELECT * FROM ruta_medico.ruta_personalizada WHERE id = $1', [
      id,
    ]);
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }
}
