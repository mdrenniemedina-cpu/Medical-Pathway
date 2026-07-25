import { Inject, Injectable } from '@nestjs/common';
import { CUENTA_REPOSITORY, CuentaRepositoryPort } from '../domain/cuenta.repository.port';

/**
 * Superficie mínima expuesta a otros bounded contexts: solo el id de cuenta
 * a partir de un email, nunca el agregado `Cuenta` completo (password hash,
 * rol, etc. no son asunto de otros contextos — ver ADR-010).
 */
@Injectable()
export class BuscarCuentaIdPorEmailUseCase {
  constructor(@Inject(CUENTA_REPOSITORY) private readonly cuentas: CuentaRepositoryPort) {}

  async ejecutar(email: string): Promise<{ id: string } | null> {
    const cuenta = await this.cuentas.buscarPorEmail(email);
    return cuenta ? { id: cuenta.id } : null;
  }
}
