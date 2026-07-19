import { Cuenta } from './cuenta.aggregate';

export interface CuentaRepositoryPort {
  guardar(cuenta: Cuenta): Promise<void>;
  buscarPorEmail(email: string): Promise<Cuenta | null>;
  buscarPorId(id: string): Promise<Cuenta | null>;
}

export const CUENTA_REPOSITORY = Symbol('CUENTA_REPOSITORY');
