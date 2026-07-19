import { ConfianzaDato } from '../value-objects/confianza-dato.vo';

export type NivelVerificacionPerfil = 'ninguno' | 'correo_verificado' | 'titulo_verificado';

const PESO_BASE_POR_VERIFICACION: Record<NivelVerificacionPerfil, number> = {
  ninguno: 0.3,
  correo_verificado: 0.6,
  titulo_verificado: 1.0,
};

/**
 * Verificación progresiva (peso de entrada) + reputación acumulada — ver
 * `13-calidad-confianza-datos-radar.md` §1-2. No bloquea la participación de
 * usuarios no verificados (el volumen de reportes es el recurso más escaso
 * del Radar en sus primeros meses); simplemente pondera su influencia.
 *
 * `reportesConsistentesPrevios` es el número de veces que este mismo perfil
 * ya actualizó un registro anterior reflejando un cambio real (p. ej.
 * reportó la resolución cuando ocurrió) — cada uno suma un pequeño bono de
 * reputación, acotado para que no domine sobre la verificación de identidad.
 */
export function calcularConfianzaInicial(
  nivelVerificacion: NivelVerificacionPerfil,
  reportesConsistentesPrevios: number,
): ConfianzaDato {
  const base = PESO_BASE_POR_VERIFICACION[nivelVerificacion];
  const bonoReputacion = Math.min(reportesConsistentesPrevios * 0.05, 0.2);
  const puntaje = Math.min(1, base + bonoReputacion);
  return ConfianzaDato.crear(puntaje);
}
