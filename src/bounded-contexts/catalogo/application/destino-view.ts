import { Destino } from '../domain/destino.aggregate';

export interface AtributoConFuenteView<T> {
  valor: T;
  fuenteUrl: string;
  fechaVerificacion: string;
}

export interface DestinoView {
  id: string;
  nombre: string;
  codigoIso: string;
  idiomaRequerido: string | null;
  nivelIdiomaRequerido: string | null;
  tiempoTipicoMeses: AtributoConFuenteView<number>;
  costeTipico: AtributoConFuenteView<{ valor: number; moneda: string }>;
  nivelDemanda: AtributoConFuenteView<string>;
  dificultadRelativa: AtributoConFuenteView<string>;
  complejidadRegulatoria: AtributoConFuenteView<string>;
}

/**
 * Todo campo se serializa SIEMPRE junto con `fuenteUrl`/`fechaVerificacion`
 * (nunca se "aplana" perdiendo la procedencia) — es el mismo principio de
 * transparencia de `AtributoConFuente` llevado hasta la respuesta de API.
 */
export function toDestinoView(destino: Destino): DestinoView {
  return {
    id: destino.id,
    nombre: destino.nombre,
    codigoIso: destino.codigoIso,
    idiomaRequerido: destino.idiomaRequerido,
    nivelIdiomaRequerido: destino.nivelIdiomaRequerido,
    tiempoTipicoMeses: {
      valor: destino.tiempoTipicoMeses.valor,
      fuenteUrl: destino.tiempoTipicoMeses.fuenteUrl,
      fechaVerificacion: destino.tiempoTipicoMeses.fechaVerificacion.toISOString(),
    },
    costeTipico: {
      valor: destino.costeTipico.valor,
      fuenteUrl: destino.costeTipico.fuenteUrl,
      fechaVerificacion: destino.costeTipico.fechaVerificacion.toISOString(),
    },
    nivelDemanda: {
      valor: destino.nivelDemanda.valor,
      fuenteUrl: destino.nivelDemanda.fuenteUrl,
      fechaVerificacion: destino.nivelDemanda.fechaVerificacion.toISOString(),
    },
    dificultadRelativa: {
      valor: destino.dificultadRelativa.valor,
      fuenteUrl: destino.dificultadRelativa.fuenteUrl,
      fechaVerificacion: destino.dificultadRelativa.fechaVerificacion.toISOString(),
    },
    complejidadRegulatoria: {
      valor: destino.complejidadRegulatoria.valor,
      fuenteUrl: destino.complejidadRegulatoria.fuenteUrl,
      fechaVerificacion: destino.complejidadRegulatoria.fechaVerificacion.toISOString(),
    },
  };
}
