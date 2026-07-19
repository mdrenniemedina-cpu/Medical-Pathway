import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';

export interface RegistrarEventoProductoParams {
  tipoEvento: string;
  perfilId?: string;
  origen: 'frontend' | 'dominio';
  propiedades?: Record<string, unknown>;
}

@Injectable()
export class EventosProductoRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async registrar(params: RegistrarEventoProductoParams): Promise<void> {
    await this.pool.query(
      `INSERT INTO analitica.evento_producto (id, tipo_evento, perfil_id, origen, propiedades)
       VALUES ($1, $2, $3, $4, $5)`,
      [nanoid(), params.tipoEvento, params.perfilId ?? null, params.origen, JSON.stringify(params.propiedades ?? {})],
    );
  }
}
