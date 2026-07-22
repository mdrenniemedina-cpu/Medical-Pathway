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
}
