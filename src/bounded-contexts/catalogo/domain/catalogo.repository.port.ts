import { Destino } from './destino.aggregate';
import { RutaHomologacion } from './ruta-homologacion.aggregate';

export interface DestinoRepositoryPort {
  guardar(destino: Destino): Promise<void>;
  listar(): Promise<Destino[]>;
  buscarPorId(id: string): Promise<Destino | null>;
}
export const DESTINO_REPOSITORY = Symbol('DESTINO_REPOSITORY');

export interface RutaHomologacionRepositoryPort {
  guardar(ruta: RutaHomologacion): Promise<void>;
  buscarPorId(id: string): Promise<RutaHomologacion | null>;
  buscarPublicadaPorDestino(destinoId: string): Promise<RutaHomologacion | null>;
}
export const RUTA_HOMOLOGACION_REPOSITORY = Symbol('RUTA_HOMOLOGACION_REPOSITORY');
