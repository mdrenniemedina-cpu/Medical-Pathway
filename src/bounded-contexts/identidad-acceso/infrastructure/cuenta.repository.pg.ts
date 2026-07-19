import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '@infrastructure/persistence/pg-pool.provider';
import { runInTransactionWithOutbox } from '@infrastructure/persistence/transaction';
import { CuentaRepositoryPort } from '../domain/cuenta.repository.port';
import { Cuenta } from '../domain/cuenta.aggregate';
import { esRolValido } from '../domain/rol';

interface CuentaRow {
  id: string;
  email: string;
  password_hash: string | null;
  proveedor_sso: string | null;
  rol: string;
  activa: boolean;
}

function toDomain(row: CuentaRow): Cuenta {
  if (!esRolValido(row.rol)) {
    throw new Error(`Rol persistido inválido: ${row.rol}`);
  }
  return Cuenta.reconstituir({
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    proveedorSso: row.proveedor_sso,
    rol: row.rol,
    activa: row.activa,
  });
}

@Injectable()
export class CuentaRepositoryPg implements CuentaRepositoryPort {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async guardar(cuenta: Cuenta): Promise<void> {
    const events = cuenta.pullDomainEvents();
    await runInTransactionWithOutbox(this.pool, async (client) => {
      await client.query(
        `INSERT INTO identidad.cuenta (id, email, password_hash, rol, activa)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, activa = EXCLUDED.activa`,
        [cuenta.id, cuenta.email, cuenta.passwordHash, cuenta.rol, cuenta.activa],
      );
      return { result: undefined, events };
    });
  }

  async buscarPorEmail(email: string): Promise<Cuenta | null> {
    const { rows } = await this.pool.query<CuentaRow>(
      `SELECT id, email, password_hash, proveedor_sso, rol, activa FROM identidad.cuenta WHERE email = $1`,
      [email.toLowerCase().trim()],
    );
    return rows[0] ? toDomain(rows[0]) : null;
  }

  async buscarPorId(id: string): Promise<Cuenta | null> {
    const { rows } = await this.pool.query<CuentaRow>(
      `SELECT id, email, password_hash, proveedor_sso, rol, activa FROM identidad.cuenta WHERE id = $1`,
      [id],
    );
    return rows[0] ? toDomain(rows[0]) : null;
  }
}
