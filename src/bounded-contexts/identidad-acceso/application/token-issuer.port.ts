export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenIssuerPort {
  emitirParaCuenta(cuentaId: string, rol: string): Promise<TokenPair>;
  refrescar(refreshToken: string): Promise<{ accessToken: string }>;
  revocar(refreshToken: string): Promise<void>;
}

export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');
