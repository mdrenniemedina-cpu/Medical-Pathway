import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';

export interface RegistrarHistoriaMedicoParams {
  etapaFormacion: string;
  haImaginadoEjercerOtroPais: boolean;
  serioInteres?: string;
  paisesInteres?: string;
  queTeHaFrenado?: string;
  incertidumbre?: string;
  frustracionBusqueda?: string;
  queHariaValerLaPena?: string;
  consideraPagar?: string;
  precioJusto?: string;
  completado: boolean;
}

export interface HistoriaMedicoRow {
  id: string;
  etapa_formacion: string;
  ha_imaginado_ejercer_otro_pais: boolean;
  serio_interes: string | null;
  paises_interes: string | null;
  que_te_ha_frenado: string | null;
  incertidumbre: string | null;
  frustracion_busqueda: string | null;
  que_haria_valer_la_pena: string | null;
  consideraria_pagar: string | null;
  precio_justo: string | null;
  completado: boolean;
  creado_en: Date;
}

export interface FiltrosHistorias {
  etapaFormacion?: string;
  serioInteres?: string;
  paisesInteres?: string;
  consideraPagar?: string;
  buscar?: string; // busca dentro de las 4 respuestas abiertas
}

/** Arma la cláusula WHERE + parámetros de forma segura (parametrizada, nunca concatenación directa). */
function armarFiltro(filtros: FiltrosHistorias): { clausula: string; valores: unknown[] } {
  const condiciones: string[] = [];
  const valores: unknown[] = [];

  if (filtros.etapaFormacion) {
    valores.push(filtros.etapaFormacion);
    condiciones.push(`etapa_formacion = $${valores.length}`);
  }
  if (filtros.serioInteres) {
    valores.push(filtros.serioInteres);
    condiciones.push(`serio_interes = $${valores.length}`);
  }
  if (filtros.consideraPagar) {
    valores.push(filtros.consideraPagar);
    condiciones.push(`consideraria_pagar = $${valores.length}`);
  }
  if (filtros.paisesInteres) {
    valores.push(`%${filtros.paisesInteres}%`);
    condiciones.push(`paises_interes ILIKE $${valores.length}`);
  }
  if (filtros.buscar) {
    valores.push(`%${filtros.buscar}%`);
    const posicion = valores.length;
    condiciones.push(
      `(que_te_ha_frenado ILIKE $${posicion} OR incertidumbre ILIKE $${posicion} OR frustracion_busqueda ILIKE $${posicion} OR que_haria_valer_la_pena ILIKE $${posicion})`,
    );
  }

  return {
    clausula: condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '',
    valores,
  };
}

@Injectable()
export class HistoriaMedicoRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async registrar(params: RegistrarHistoriaMedicoParams): Promise<void> {
    await this.pool.query(
      `INSERT INTO historias.historia_medico (
         id, etapa_formacion, ha_imaginado_ejercer_otro_pais, serio_interes, paises_interes,
         que_te_ha_frenado, incertidumbre, frustracion_busqueda, que_haria_valer_la_pena,
         consideraria_pagar, precio_justo, completado
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        nanoid(),
        params.etapaFormacion,
        params.haImaginadoEjercerOtroPais,
        params.serioInteres ?? null,
        params.paisesInteres ?? null,
        params.queTeHaFrenado ?? null,
        params.incertidumbre ?? null,
        params.frustracionBusqueda ?? null,
        params.queHariaValerLaPena ?? null,
        params.consideraPagar ?? null,
        params.precioJusto ?? null,
        params.completado,
      ],
    );
  }

  /** Usado por el panel de administración (listado + filtros); ver AdminBasicAuthGuard. */
  async listar(filtros: FiltrosHistorias): Promise<HistoriaMedicoRow[]> {
    const { clausula, valores } = armarFiltro(filtros);
    const { rows } = await this.pool.query<HistoriaMedicoRow>(
      `SELECT * FROM historias.historia_medico ${clausula} ORDER BY creado_en DESC`,
      valores,
    );
    return rows;
  }

  async contarTotal(): Promise<number> {
    const { rows } = await this.pool.query<{ total: string }>('SELECT COUNT(*)::text AS total FROM historias.historia_medico');
    return Number(rows[0]?.total ?? 0);
  }
}
