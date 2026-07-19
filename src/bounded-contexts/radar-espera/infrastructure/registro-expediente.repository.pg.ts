import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { RegistroExpedienteRepositoryPort } from '../domain/registro-expediente.repository.port';
import { RegistroExpediente } from '../domain/registro-expediente.aggregate';
import { TipoExpediente } from '../domain/value-objects/tipo-expediente.vo';
import { VentanaEnvio } from '../domain/value-objects/ventana-envio.vo';
import { ResultadoResolucion, EstadoResolucion } from '../domain/value-objects/resultado-resolucion.vo';
import { ConfianzaDato } from '../domain/value-objects/confianza-dato.vo';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';

interface RegistroRow {
  id: string;
  perfil_id: string;
  destino_id: string;
  ruta_homologacion_id: string;
  region: string | null;
  especialidad: string | null;
  ventana_envio_anio: number;
  ventana_envio_trimestre: number;
  resultado: EstadoResolucion;
  fecha_resolucion: Date | null;
  confianza_dato: string;
  marcado_anomalo: boolean;
  confirmado_por_usuario: boolean;
}

function toDomain(row: RegistroRow): RegistroExpediente {
  const ventana = VentanaEnvio.crear(row.ventana_envio_anio, row.ventana_envio_trimestre);
  const resultado =
    row.resultado === 'pendiente'
      ? ResultadoResolucion.pendiente()
      : ResultadoResolucion.resuelto(
          row.resultado,
          new Date(row.fecha_resolucion as Date),
          new Date(row.ventana_envio_anio, (row.ventana_envio_trimestre - 1) * 3, 1),
        );
  return RegistroExpediente.reconstituir({
    id: row.id,
    perfilId: row.perfil_id,
    tipoExpediente: TipoExpediente.crear({
      destinoId: row.destino_id,
      rutaHomologacionId: row.ruta_homologacion_id,
      region: row.region ?? undefined,
      especialidad: row.especialidad ?? undefined,
    }),
    ventanaEnvio: ventana,
    resultado,
    confianza: ConfianzaDato.crear(Number(row.confianza_dato)),
    marcadoAnomalo: row.marcado_anomalo,
    confirmadoPorUsuario: row.confirmado_por_usuario,
  });
}

@Injectable()
export class RegistroExpedienteRepositoryPg implements RegistroExpedienteRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(registro: RegistroExpediente): Promise<void> {
    const events = registro.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO radar_espera.registro_expediente (
           id, perfil_id, destino_id, ruta_homologacion_id, region, especialidad,
           ventana_envio_anio, ventana_envio_trimestre, resultado, fecha_resolucion,
           confianza_dato, marcado_anomalo, confirmado_por_usuario
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET
           resultado = EXCLUDED.resultado,
           fecha_resolucion = EXCLUDED.fecha_resolucion,
           confianza_dato = EXCLUDED.confianza_dato,
           marcado_anomalo = EXCLUDED.marcado_anomalo,
           confirmado_por_usuario = EXCLUDED.confirmado_por_usuario`,
        [
          registro.id,
          registro.perfilId,
          registro.tipoExpediente.destinoId,
          registro.tipoExpediente.rutaHomologacionId,
          registro.tipoExpediente.region ?? null,
          registro.tipoExpediente.especialidad ?? null,
          registro.ventanaEnvio.anio,
          registro.ventanaEnvio.trimestre,
          registro.resultado.estado,
          registro.resultado.fechaResolucion ?? null,
          registro.confianza.puntaje,
          registro.marcadoAnomalo,
          registro.confirmadoPorUsuario,
        ],
      );
      return { result: undefined, events };
    });
  }

  async buscarPorId(id: string): Promise<RegistroExpediente | null> {
    const { rows } = await this.pool.query<RegistroRow>('SELECT * FROM radar_espera.registro_expediente WHERE id = $1', [id]);
    return rows[0] ? toDomain(rows[0]) : null;
  }

  async buscarPorPerfilDestinoRuta(perfilId: string, destinoId: string, rutaHomologacionId: string): Promise<RegistroExpediente | null> {
    const { rows } = await this.pool.query<RegistroRow>(
      `SELECT * FROM radar_espera.registro_expediente WHERE perfil_id = $1 AND destino_id = $2 AND ruta_homologacion_id = $3`,
      [perfilId, destinoId, rutaHomologacionId],
    );
    return rows[0] ? toDomain(rows[0]) : null;
  }

  async obtenerEstadisticasCohorte(
    destinoId: string,
    rutaHomologacionId: string,
    anio: number,
    trimestre: number,
  ): Promise<{ media: number; desviacionEstandar: number; n: number } | null> {
    const { rows } = await this.pool.query<{ media: string | null; desviacion: string | null; n: string }>(
      `SELECT
         avg(extract(epoch FROM (fecha_resolucion - make_date($3, ($4::int - 1) * 3 + 1, 1))) / 86400) AS media,
         stddev_samp(extract(epoch FROM (fecha_resolucion - make_date($3, ($4::int - 1) * 3 + 1, 1))) / 86400) AS desviacion,
         count(*) AS n
       FROM radar_espera.registro_expediente
       WHERE destino_id = $1 AND ruta_homologacion_id = $2
         AND ventana_envio_anio = $3 AND ventana_envio_trimestre = $4
         AND resultado <> 'pendiente' AND marcado_anomalo = false AND confirmado_por_usuario = true`,
      [destinoId, rutaHomologacionId, anio, trimestre],
    );
    const row = rows[0];
    if (!row || Number(row.n) < 3 || row.media === null) return null;
    return { media: Number(row.media), desviacionEstandar: Number(row.desviacion ?? 0), n: Number(row.n) };
  }
}
