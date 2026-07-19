import { Global, Module } from '@nestjs/common';
import { pgPoolProvider } from './pg-pool.provider';

/**
 * `@Global()` deliberado: el Pool de Postgres es infraestructura pura
 * compartida (no dominio, no reglas de negocio) — todos los bounded contexts
 * lo necesitan para sus repositorios concretos. Esto NO es una excepción a
 * los límites de contexto (ver ADR-010): un context nunca importa el
 * repositorio *de otro* context, solo comparte el mecanismo de conexión.
 */
@Global()
@Module({
  providers: [pgPoolProvider],
  exports: [pgPoolProvider],
})
export class PersistenceModule {}
