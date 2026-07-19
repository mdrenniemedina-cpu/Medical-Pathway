import { PerfilInternacional } from './perfil-internacional.aggregate';

export interface PerfilRepositoryPort {
  guardar(perfil: PerfilInternacional): Promise<void>;
  buscarPorId(id: string): Promise<PerfilInternacional | null>;
  buscarPorCuentaId(cuentaId: string): Promise<PerfilInternacional | null>;
}

export const PERFIL_REPOSITORY = Symbol('PERFIL_REPOSITORY');
