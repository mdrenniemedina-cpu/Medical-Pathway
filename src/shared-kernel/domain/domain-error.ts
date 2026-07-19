/**
 * Error de invariante de dominio. Se usa exclusivamente para violaciones de reglas de
 * negocio (nunca para errores técnicos/infraestructura) — permite a la capa de aplicación
 * traducirlo a un código HTTP 422/400 sin acoplar el dominio a HTTP.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
