import { DestinoParaComparar } from '../../domain/servicios/motor-compatibilidad.service';

/** ACL hacia el Catálogo — ver `infrastructure/catalogo.acl.ts`. */
export interface DestinosParaCompararPort {
  listar(): Promise<DestinoParaComparar[]>;
}
export const DESTINOS_PARA_COMPARAR = Symbol('DESTINOS_PARA_COMPARAR');
