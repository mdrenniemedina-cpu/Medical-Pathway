import { ResultadoDescubrimiento } from '../domain/resultado-descubrimiento.aggregate';
import { AccionRecomendada } from '../domain/servicios/analizador-brechas.service';

export interface RazonView {
  criterio: string;
  aportePuntos: number;
  explicacionLegible: string;
}
export interface PuntuacionDestinoView {
  destinoId: string;
  porcentajeCompatibilidad: number;
  razones: RazonView[];
  /** "Qué te falta" / "qué acciones aumentarían tus oportunidades" — ver AnalizadorDeBrechas. Vacío si no hay ninguna acción de perfil aplicable. */
  accionesRecomendadas: AccionRecomendada[];
}
export interface ResultadoDescubrimientoView {
  resultadoId: string;
  generadoEn: string;
  puntuaciones: PuntuacionDestinoView[];
}

export function toResultadoView(
  resultado: ResultadoDescubrimiento,
  accionesPorDestino: Map<string, AccionRecomendada[]>,
): ResultadoDescubrimientoView {
  return {
    resultadoId: resultado.id,
    generadoEn: resultado.generadoEn.toISOString(),
    puntuaciones: resultado.puntuaciones.map((p) => ({
      destinoId: p.destinoId,
      porcentajeCompatibilidad: p.porcentajeCompatibilidad,
      razones: p.razones.map((r) => ({
        criterio: r.criterio,
        aportePuntos: r.aportePuntos,
        explicacionLegible: r.explicacionLegible,
      })),
      accionesRecomendadas: accionesPorDestino.get(p.destinoId) ?? [],
    })),
  };
}
