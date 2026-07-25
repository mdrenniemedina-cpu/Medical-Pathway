/**
 * Public API (Open Host Service) del contexto Identidad y Acceso.
 * Ningún otro bounded context puede importar nada de `domain/`,
 * `application/` ni `infrastructure/` de este contexto directamente —
 * solo lo que se exporta aquí. Ver ADR-010 y test/architecture/boundaries.spec.ts.
 */
export { IdentidadAccesoModule } from '../infrastructure/identidad-acceso.module';
export { JwtAuthGuard } from '../infrastructure/jwt-auth.guard';
export { CurrentAccount } from '../infrastructure/current-account.decorator';
export type { JwtPayload } from '../infrastructure/jwt.strategy';
export { CuentaRegistradaEvent } from '../domain/events/cuenta-registrada.event';
export { BuscarCuentaIdPorEmailUseCase } from '../application/buscar-cuenta-id-por-email.use-case';
