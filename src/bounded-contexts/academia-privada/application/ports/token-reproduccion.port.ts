export const TOKEN_REPRODUCCION_PORT = Symbol('TOKEN_REPRODUCCION_PORT');

export interface TokenReproduccionPort {
  /** Firma un token de un solo recurso, válido por `ttlSegundos` desde ahora. */
  firmar(params: { cuentaId: string; recurso: string; ttlSegundos: number }): string;
  /** Verifica firma + expiración. Devuelve el recurso si es válido, o null si no. */
  verificar(token: string): { cuentaId: string; recurso: string } | null;
}
