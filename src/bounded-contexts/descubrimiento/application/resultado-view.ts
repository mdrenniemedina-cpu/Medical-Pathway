import { ResultadoDescubrimiento } from '../domain/resultado-descubrimiento.aggregate';

export interface RazonView {
  criterio: string;
  aportePuntos: number;
  explicacionLegible: string;
}
export interface PuntuacionDestinoView {
  destinoId: string;
  porcentajeCompatibilidad: number;
  razones: RazonView[];
}
export interface ResultadoDescubrimientoView {
  resultadoId: string;
  generadoEn: string;
  puntuaciones: PuntuacionDestinoView[];
}

export function toResultadoView(resultado: ResultadoDescubrimiento): ResultadoDescubrimientoView {
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
    })),
  };
}
