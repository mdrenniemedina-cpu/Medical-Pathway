import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';
import { DestinoRepositoryPort } from '../domain/catalogo.repository.port';
import { Destino, DificultadRelativa, NivelDemanda } from '../domain/destino.aggregate';
import { AtributoConFuente } from '../domain/value-objects/atributo-con-fuente.vo';

interface DestinoRow {
  id: string;
  nombre: string;
  codigo_iso: string;
  idioma_requerido: string | null;
  nivel_idioma_requerido: string | null;
  tiempo_tipico_meses_valor: number;
  tiempo_tipico_meses_fuente_url: string;
  tiempo_tipico_meses_fecha_verificacion: Date;
  coste_tipico_valor: string;
  coste_tipico_moneda: string;
  coste_tipico_fuente_url: string;
  coste_tipico_fecha_verificacion: Date;
  nivel_demanda_valor: NivelDemanda;
  nivel_demanda_fuente_url: string;
  nivel_demanda_fecha_verificacion: Date;
  dificultad_relativa_valor: DificultadRelativa;
  dificultad_relativa_fuente_url: string;
  dificultad_relativa_fecha_verificacion: Date;
  complejidad_regulatoria_valor: DificultadRelativa;
  complejidad_regulatoria_fuente_url: string;
  complejidad_regulatoria_fecha_verificacion: Date;
  locale_default: string;
}

function toDomain(row: DestinoRow): Destino {
  return Destino.crear({
    id: row.id,
    nombre: row.nombre,
    codigoIso: row.codigo_iso,
    idiomaRequerido: row.idioma_requerido,
    nivelIdiomaRequerido: row.nivel_idioma_requerido,
    tiempoTipicoMeses: AtributoConFuente.crear(
      row.tiempo_tipico_meses_valor,
      row.tiempo_tipico_meses_fuente_url,
      new Date(row.tiempo_tipico_meses_fecha_verificacion),
    ),
    costeTipico: AtributoConFuente.crear(
      { valor: Number(row.coste_tipico_valor), moneda: row.coste_tipico_moneda },
      row.coste_tipico_fuente_url,
      new Date(row.coste_tipico_fecha_verificacion),
    ),
    nivelDemanda: AtributoConFuente.crear(
      row.nivel_demanda_valor,
      row.nivel_demanda_fuente_url,
      new Date(row.nivel_demanda_fecha_verificacion),
    ),
    dificultadRelativa: AtributoConFuente.crear(
      row.dificultad_relativa_valor,
      row.dificultad_relativa_fuente_url,
      new Date(row.dificultad_relativa_fecha_verificacion),
    ),
    complejidadRegulatoria: AtributoConFuente.crear(
      row.complejidad_regulatoria_valor,
      row.complejidad_regulatoria_fuente_url,
      new Date(row.complejidad_regulatoria_fecha_verificacion),
    ),
    localeDefault: row.locale_default,
  });
}

@Injectable()
export class DestinoRepositoryPg implements DestinoRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(destino: Destino): Promise<void> {
    const events = destino.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO catalogo.destino (
           id, nombre, codigo_iso, idioma_requerido, nivel_idioma_requerido,
           tiempo_tipico_meses_valor, tiempo_tipico_meses_fuente_url, tiempo_tipico_meses_fecha_verificacion,
           coste_tipico_valor, coste_tipico_moneda, coste_tipico_fuente_url, coste_tipico_fecha_verificacion,
           nivel_demanda_valor, nivel_demanda_fuente_url, nivel_demanda_fecha_verificacion,
           dificultad_relativa_valor, dificultad_relativa_fuente_url, dificultad_relativa_fecha_verificacion,
           complejidad_regulatoria_valor, complejidad_regulatoria_fuente_url, complejidad_regulatoria_fecha_verificacion,
           locale_default
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
         ON CONFLICT (id) DO NOTHING`,
        [
          destino.id,
          destino.nombre,
          destino.codigoIso,
          destino.idiomaRequerido,
          destino.nivelIdiomaRequerido,
          destino.tiempoTipicoMeses.valor,
          destino.tiempoTipicoMeses.fuenteUrl,
          destino.tiempoTipicoMeses.fechaVerificacion,
          destino.costeTipico.valor.valor,
          destino.costeTipico.valor.moneda,
          destino.costeTipico.fuenteUrl,
          destino.costeTipico.fechaVerificacion,
          destino.nivelDemanda.valor,
          destino.nivelDemanda.fuenteUrl,
          destino.nivelDemanda.fechaVerificacion,
          destino.dificultadRelativa.valor,
          destino.dificultadRelativa.fuenteUrl,
          destino.dificultadRelativa.fechaVerificacion,
          destino.complejidadRegulatoria.valor,
          destino.complejidadRegulatoria.fuenteUrl,
          destino.complejidadRegulatoria.fechaVerificacion,
          destino.localeDefault,
        ],
      );
      return { result: undefined, events };
    });
  }

  async listar(): Promise<Destino[]> {
    const { rows } = await this.pool.query<DestinoRow>('SELECT * FROM catalogo.destino ORDER BY nombre');
    return rows.map(toDomain);
  }

  async buscarPorId(id: string): Promise<Destino | null> {
    const { rows } = await this.pool.query<DestinoRow>('SELECT * FROM catalogo.destino WHERE id = $1', [id]);
    return rows[0] ? toDomain(rows[0]) : null;
  }
}
