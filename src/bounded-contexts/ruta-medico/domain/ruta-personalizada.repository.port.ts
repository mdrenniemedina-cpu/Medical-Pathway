import { RutaPersonalizada } from './ruta-personalizada.aggregate';

export interface RutaPersonalizadaRepositoryPort {
  guardar(ruta: RutaPersonalizada): Promise<void>;
  buscarActivaPorPerfilYDestino(perfilId: string, destinoId: string): Promise<RutaPersonalizada | null>;
  buscarPorId(id: string): Promise<RutaPersonalizada | null>;
}
export const RUTA_PERSONALIZADA_REPOSITORY = Symbol('RUTA_PERSONALIZADA_REPOSITORY');
