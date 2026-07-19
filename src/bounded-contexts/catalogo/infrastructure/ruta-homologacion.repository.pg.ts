import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';
import { RutaHomologacionRepositoryPort } from '../domain/catalogo.repository.port';
import { RutaHomologacion } from '../domain/ruta-homologacion.aggregate';
import { EtapaRuta, TipoEtapa } from '../domain/etapa-ruta.entity';
import { AtributoConFuente } from '../domain/value-objects/atributo-con-fuente.vo';

interface RutaRow {
  id: string;
  destino_id: string;
  nombre: string;
  publicada: boolean;
  version: number;
}
interface EtapaRow {
  id: string;
  orden: number;
  nombre: string;
  descripcion: string;
  tipo: TipoEtapa;
  duracion_tipica_valor: number;
  duracion_tipica_fuente_url: string;
  duracion_tipica_fecha_verificacion: Date;
  es_configurable_por_perfil: boolean;
  prerequisito_etapa_id: string | null;
}

async function hidratar(pool: Pool, row: RutaRow): Promise<RutaHomologacion> {
  const { rows: etapaRows } = await pool.query<EtapaRow>(
    'SELECT * FROM catalogo.etapa_ruta WHERE ruta_id = $1 ORDER BY orden',
    [row.id],
  );
  const etapas = etapaRows.map((e) =>
    EtapaRuta.crear({
      id: e.id,
      orden: e.orden,
      nombre: e.nombre,
      descripcion: e.descripcion,
      tipo: e.tipo,
      duracionTipicaDias: AtributoConFuente.crear(
        e.duracion_tipica_valor,
        e.duracion_tipica_fuente_url,
        new Date(e.duracion_tipica_fecha_verificacion),
      ),
      esConfigurablePorPerfil: e.es_configurable_por_perfil,
      prerequisitoEtapaId: e.prerequisito_etapa_id ?? undefined,
    }),
  );
  return RutaHomologacion.reconstituir({
    id: row.id,
    destinoId: row.destino_id,
    nombre: row.nombre,
    publicada: row.publicada,
    version: row.version,
    etapas,
  });
}

@Injectable()
export class RutaHomologacionRepositoryPg implements RutaHomologacionRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(ruta: RutaHomologacion): Promise<void> {
    const events = ruta.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO catalogo.ruta_homologacion (id, destino_id, nombre, publicada, version)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET publicada = EXCLUDED.publicada, version = EXCLUDED.version`,
        [ruta.id, ruta.destinoId, ruta.nombre, ruta.publicada, ruta.version],
      );
      await client.query('DELETE FROM catalogo.etapa_ruta WHERE ruta_id = $1', [ruta.id]);
      for (const etapa of ruta.etapas) {
        await client.query(
          `INSERT INTO catalogo.etapa_ruta (
             id, ruta_id, orden, nombre, descripcion, tipo,
             duracion_tipica_valor, duracion_tipica_fuente_url, duracion_tipica_fecha_verificacion,
             es_configurable_por_perfil, prerequisito_etapa_id
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            etapa.id || nanoid(),
            ruta.id,
            etapa.orden,
            etapa.nombre,
            etapa.nombre,
            etapa.tipo,
            etapa.duracionTipicaDias.valor,
            etapa.duracionTipicaDias.fuenteUrl,
            etapa.duracionTipicaDias.fechaVerificacion,
            etapa.esConfigurablePorPerfil,
            etapa.prerequisitoEtapaId ?? null,
          ],
        );
      }
      return { result: undefined, events };
    });
  }

  async buscarPorId(id: string): Promise<RutaHomologacion | null> {
    const { rows } = await this.pool.query<RutaRow>('SELECT * FROM catalogo.ruta_homologacion WHERE id = $1', [id]);
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }

  async buscarPublicadaPorDestino(destinoId: string): Promise<RutaHomologacion | null> {
    const { rows } = await this.pool.query<RutaRow>(
      'SELECT * FROM catalogo.ruta_homologacion WHERE destino_id = $1 AND publicada = true ORDER BY version DESC LIMIT 1',
      [destinoId],
    );
    return rows[0] ? hidratar(this.pool, rows[0]) : null;
  }
}
