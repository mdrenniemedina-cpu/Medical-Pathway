import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { ReglaCompatibilidadRepositoryPort } from '../domain/descubrimiento.repository.port';
import { ReglaCompatibilidad } from '../domain/regla-compatibilidad.entity';

interface ReglaRow {
  id: string;
  atributo_perfil: string;
  atributo_destino: string;
  peso: string;
  version: number;
  activa: boolean;
}

@Injectable()
export class ReglaCompatibilidadRepositoryPg implements ReglaCompatibilidadRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async listarActivas(): Promise<ReglaCompatibilidad[]> {
    const { rows } = await this.pool.query<ReglaRow>(
      'SELECT * FROM descubrimiento.regla_compatibilidad WHERE activa = true',
    );
    return rows.map((r) =>
      ReglaCompatibilidad.crear({
        id: r.id,
        atributoPerfil: r.atributo_perfil,
        atributoDestino: r.atributo_destino,
        peso: Number(r.peso),
        version: r.version,
        activa: r.activa,
      }),
    );
  }
}
