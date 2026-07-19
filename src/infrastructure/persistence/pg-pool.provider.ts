import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const PG_POOL = Symbol('PG_POOL');

/**
 * Un único Pool de conexiones compartido por todo el monolito. Cada bounded
 * context escribe únicamente en su propio schema (`SET search_path` o
 * columnas/tablas prefijadas por schema en el SQL) — el aislamiento es de
 * modelo y de convención de queries, no de conexión física (ver ADR-010).
 */
export const pgPoolProvider: Provider = {
  provide: PG_POOL,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Pool => {
    return new Pool({
      connectionString: config.get<string>('DATABASE_URL'),
      ssl: config.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
    });
  },
};
