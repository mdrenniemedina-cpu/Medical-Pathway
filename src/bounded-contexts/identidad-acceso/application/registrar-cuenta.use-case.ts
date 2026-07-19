import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { Cuenta } from '../domain/cuenta.aggregate';
import { CUENTA_REPOSITORY, CuentaRepositoryPort } from '../domain/cuenta.repository.port';
import { PASSWORD_HASHER, PasswordHasherPort } from './password-hasher.port';
import { TOKEN_ISSUER, TokenIssuerPort, TokenPair } from './token-issuer.port';

@Injectable()
export class RegistrarCuentaUseCase {
  constructor(
    @Inject(CUENTA_REPOSITORY) private readonly cuentas: CuentaRepositoryPort,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasherPort,
    @Inject(TOKEN_ISSUER) private readonly tokens: TokenIssuerPort,
  ) {}

  async ejecutar(email: string, password: string): Promise<TokenPair> {
    const existente = await this.cuentas.buscarPorEmail(email);
    if (existente) {
      throw new DomainError('Ya existe una cuenta con este email.', 'CUENTA_YA_EXISTE');
    }
    const passwordHash = await this.hasher.hash(password);
    const cuenta = Cuenta.registrar({ id: nanoid(), email, passwordHash });
    await this.cuentas.guardar(cuenta);
    return this.tokens.emitirParaCuenta(cuenta.id, cuenta.rol);
  }
}
