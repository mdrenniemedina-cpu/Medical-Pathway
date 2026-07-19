import { DomainError } from '@shared-kernel/domain/domain-error';

/**
 * Orden ascendente deliberado: el índice en el arreglo define la jerarquía
 * usada por la invariante "solo puede subir" en `PerfilInternacional`.
 */
export const NIVELES_VERIFICACION = ['ninguno', 'correo_verificado', 'titulo_verificado'] as const;
export type NivelVerificacion = (typeof NIVELES_VERIFICACION)[number];

export function esAscenso(actual: NivelVerificacion, propuesto: NivelVerificacion): boolean {
  return NIVELES_VERIFICACION.indexOf(propuesto) > NIVELES_VERIFICACION.indexOf(actual);
}

export function validarNivelVerificacion(valor: string): NivelVerificacion {
  if (!(NIVELES_VERIFICACION as readonly string[]).includes(valor)) {
    throw new DomainError(`Nivel de verificación inválido: ${valor}.`, 'NIVEL_VERIFICACION_INVALIDO');
  }
  return valor as NivelVerificacion;
}
