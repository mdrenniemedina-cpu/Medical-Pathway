import { PerfilParaComparar } from '../../domain/servicios/motor-compatibilidad.service';

/**
 * Puerto que aísla a Descubrimiento de la forma exacta de `PerfilSnapshot`
 * de Perfil Internacional. La implementación (infrastructure/perfil.acl.ts)
 * es la única pieza que conoce ambos lados — un Anti-Corruption Layer.
 */
export interface PerfilParaCompararPort {
  obtener(perfilId: string): Promise<PerfilParaComparar>;
}
export const PERFIL_PARA_COMPARAR = Symbol('PERFIL_PARA_COMPARAR');
