import { NivelVerificacionPerfil } from '../../domain/servicios/calculador-confianza.service';

/** ACL hacia Perfil Internacional — solo necesitamos el nivel de verificación. */
export interface PerfilVerificacionPort {
  obtenerNivelVerificacion(perfilId: string): Promise<NivelVerificacionPerfil>;
}
export const PERFIL_VERIFICACION = Symbol('PERFIL_VERIFICACION');
