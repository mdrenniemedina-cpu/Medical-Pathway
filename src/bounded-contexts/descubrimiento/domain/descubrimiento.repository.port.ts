import { ResultadoDescubrimiento } from './resultado-descubrimiento.aggregate';
import { ReglaCompatibilidad } from './regla-compatibilidad.entity';

export interface ResultadoRepositoryPort {
  guardar(resultado: ResultadoDescubrimiento): Promise<void>;
  buscarPorId(id: string): Promise<ResultadoDescubrimiento | null>;
}
export const RESULTADO_REPOSITORY = Symbol('RESULTADO_REPOSITORY');

export interface ReglaCompatibilidadRepositoryPort {
  listarActivas(): Promise<ReglaCompatibilidad[]>;
}
export const REGLA_COMPATIBILIDAD_REPOSITORY = Symbol('REGLA_COMPATIBILIDAD_REPOSITORY');
