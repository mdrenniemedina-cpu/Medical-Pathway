/**
 * Public API (Open Host Service) del contexto Academia Privada.
 * Ningún otro bounded context puede importar nada de `domain/`,
 * `application/` ni `infrastructure/` de este contexto directamente —
 * solo lo que se exporta aquí. Ver ADR-010 y test/architecture/boundaries.spec.ts.
 * Hoy no hay ningún otro contexto que necesite consumir este módulo — se
 * mantiene la carpeta por convención y para no romper la regla si eso cambia.
 */
export { AcademiaPrivadaModule } from '../infrastructure/academia-privada.module';
