/**
 * Ver `13-calidad-confianza-datos-radar.md` §3. Un outlier estadístico se
 * MARCA para revisión humana, nunca se descarta automáticamente — un caso
 * atípico legítimo (p. ej. un expediente real atascado 5 años, documentado
 * en `research/01-pathways-spain-germany-brazil.md`) es información valiosa
 * que el producto no debe censurar solo por ser inusual.
 */
export interface ResultadoDeteccionAnomalia {
  esAnomalo: boolean;
  motivo?: string;
}

const DESVIACIONES_MAXIMAS_SIN_REVISION = 3;

export function detectarOutlierEstadistico(
  diasReportados: number,
  mediaCohorte: number | undefined,
  desviacionEstandarCohorte: number | undefined,
): ResultadoDeteccionAnomalia {
  if (mediaCohorte === undefined || desviacionEstandarCohorte === undefined || desviacionEstandarCohorte === 0) {
    return { esAnomalo: false }; // sin suficiente historia de cohorte todavía para juzgar
  }
  const desviaciones = Math.abs(diasReportados - mediaCohorte) / desviacionEstandarCohorte;
  if (desviaciones > DESVIACIONES_MAXIMAS_SIN_REVISION) {
    return {
      esAnomalo: true,
      motivo: `El tiempo reportado (${diasReportados} días) se desvía ${desviaciones.toFixed(1)} desviaciones estándar de su cohorte — marcado para revisión, no descartado.`,
    };
  }
  return { esAnomalo: false };
}

export function detectarDuplicadoExacto(existentes: number, mismosCamposClave: number): ResultadoDeteccionAnomalia {
  if (mismosCamposClave >= 2 && existentes > 0) {
    return {
      esAnomalo: true,
      motivo: 'Existen múltiples registros con los mismos campos clave desde perfiles distintos — posible ráfaga coordinada.',
    };
  }
  return { esAnomalo: false };
}
