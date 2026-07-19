import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CUENTA_REPOSITORY, CuentaRepositoryPort } from '../domain/cuenta.repository.port';
import { PASSWORD_HASHER, PasswordHasherPort } from './password-hasher.port';
import { TOKEN_ISSUER, TokenIssuerPort, TokenPair } from './token-issuer.port';

@Injectable()
export class IniciarSesionUseCase {
  constructor(
    @Inject(CUENTA_REPOSITORY) private readonly cuentas: CuentaRepositoryPort,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasherPort,
    @Inject(TOKEN_ISSUER) private readonly tokens: TokenIssuerPort,
  ) {}

  async ejecutar(email: string, password: string): Promise<TokenPair> {
    const cuenta = await this.cuentas.buscarPorEmail(email);
    if (!cuenta || !cuenta.activa || !cuenta.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const valido = await this.hasher.verify(cuenta.passwordHash, password);
    if (!valido) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    return this.tokens.emitirParaCuenta(cuenta.id, cuenta.rol);
  }
}
