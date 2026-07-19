import { RutaHomologacionView } from './ruta-homologacion-view';

export interface EtapaProyectadaView {
  nombre: string;
  tipo: string;
  mesInicioEstimado: number;
  mesFinEstimado: number;
  duracionTipicaDias: number;
  fuenteUrl: string;
  fechaVerificacion: string;
  esOpcional: boolean;
}

export interface ProyeccionRutaView {
  destinoId: string;
  /** Duración total si el usuario recorre TODAS las etapas, incluidas las opcionales (p. ej. MIR). */
  totalMesesEstimado: number;
  /** Duración práctica mínima si el usuario omite las etapas opcionales (ver `esConfigurablePorPerfil`). */
  totalMesesEstimadoSinOpcionales: number;
  etapas: EtapaProyectadaView[];
}

const DIAS_POR_MES = 30;
const redondear = (dias: number): number => Math.round((dias / DIAS_POR_MES) * 10) / 10;

/**
 * "Ayudar al usuario a visualizar su futuro, no solo comparar países"
 * (instrucción explícita del founder, Sprint 1): convierte la ruta de
 * homologación (ya sourced y con fecha de verificación, ver
 * `AtributoConFuente`) en una línea de tiempo acumulada. Es un cálculo puro
 * sobre datos ya existentes — no introduce ninguna estimación nueva sin
 * fuente, cada mes proyectado es trazable al `duracionTipicaDias` de su
 * etapa de origen.
 */
export function toProyeccionView(ruta: RutaHomologacionView): ProyeccionRutaView {
  let cursorDias = 0;
  let diasSinOpcionales = 0;
  const etapas: EtapaProyectadaView[] = [];

  for (const etapa of ruta.etapas) {
    const inicio = cursorDias;
    const fin = cursorDias + etapa.duracionTipicaDias.valor;
    etapas.push({
      nombre: etapa.nombre,
      tipo: etapa.tipo,
      mesInicioEstimado: redondear(inicio),
      mesFinEstimado: redondear(fin),
      duracionTipicaDias: etapa.duracionTipicaDias.valor,
      fuenteUrl: etapa.duracionTipicaDias.fuenteUrl,
      fechaVerificacion: etapa.duracionTipicaDias.fechaVerificacion,
      esOpcional: etapa.esConfigurablePorPerfil,
    });
    cursorDias = fin;
    if (!etapa.esConfigurablePorPerfil) {
      diasSinOpcionales += etapa.duracionTipicaDias.valor;
    }
  }

  return {
    destinoId: ruta.destinoId,
    totalMesesEstimado: redondear(cursorDias),
    totalMesesEstimadoSinOpcionales: redondear(diasSinOpcionales),
    etapas,
  };
}
