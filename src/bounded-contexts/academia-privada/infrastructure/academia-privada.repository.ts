import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { AccesoCursoProps } from '../domain/acceso-curso';
import { AccesoCursoRepositoryPort } from '../domain/academia-privada.repository.port';

interface FilaAccesoCurso {
  id: string;
  cuenta_id: string;
  curso_id: string;
  habilitado: boolean;
  fecha_expiracion: Date | null;
}

@Injectable()
export class AcademiaPrivadaRepository implements AccesoCursoRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async buscar(cuentaId: string, cursoId: string): Promise<AccesoCursoProps | null> {
    const { rows } = await this.pool.query<FilaAccesoCurso>(
      `SELECT id, cuenta_id, curso_id, habilitado, fecha_expiracion
       FROM academia_privada.acceso_curso WHERE cuenta_id = $1 AND curso_id = $2`,
      [cuentaId, cursoId],
    );
    const fila = rows[0];
    if (!fila) return null;
    return {
      id: fila.id,
      cuentaId: fila.cuenta_id,
      cursoId: fila.curso_id,
      habilitado: fila.habilitado,
      fechaExpiracion: fila.fecha_expiracion,
    };
  }

  async registrarVisualizacion(cuentaId: string, cursoId: string, recurso: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO academia_privada.recurso_visto (id, cuenta_id, curso_id, recurso) VALUES ($1,$2,$3,$4)`,
      [nanoid(), cuentaId, cursoId, recurso],
    );
  }
}
