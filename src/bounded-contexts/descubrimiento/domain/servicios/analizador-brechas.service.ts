import { calcularPuntuaciones, DestinoParaComparar, PerfilParaComparar } from './motor-compatibilidad.service';
import { ReglaCompatibilidad } from '../regla-compatibilidad.entity';

export interface AccionRecomendada {
  criterio: string;
  descripcionAccion: string;
  impactoEstimadoPuntos: number;
  porcentajeResultanteEstimado: number;
}

/**
 * Motor de "qué te falta" / "qué acciones aumentarían tus oportunidades"
 * (pedido explícitamente por el founder para el Sprint 1). Deliberadamente
 * NO es un sistema nuevo ni una aproximación: re-ejecuta el MISMO motor de
 * reglas (`calcularPuntuaciones`) con un perfil hipotético que refleja la
 * acción sugerida, y mide la diferencia real — es tan trazable como la
 * propia recomendación, porque es literalmente la propia recomendación
 * recalculada (ver `decisions/ADR-022`).
 *
 * LIMITACIÓN HONESTA (documentada también en `docs/17-informe-sprint-1.md`):
 * con el conjunto de reglas actual, el único criterio que el usuario puede
 * cambiar activamente es el idioma (`barrera_idioma`) — demanda laboral,
 * tiempo de espera y complejidad regulatoria son atributos estructurales
 * del destino, no del perfil, y por tanto no generan una "acción" (no tiene
 * sentido sugerir "haz que España sea más rápida"). Esto limita hoy el
 * motor de brechas a sugerencias de idioma; ampliar los criterios
 * accionables (certificaciones, experiencia) es trabajo de Sprint 2+.
 */
export function analizarBrechas(
  perfil: PerfilParaComparar,
  destino: DestinoParaComparar,
  reglas: ReglaCompatibilidad[],
): AccionRecomendada[] {
  const acciones: AccionRecomendada[] = [];

  if (destino.idiomaRequerido) {
    const yaDomina = perfil.idiomasDominados.some((i) => i.idioma === destino.idiomaRequerido);
    if (!yaDomina) {
      const actual = calcularPuntuaciones(perfil, [destino], reglas)[0];
      const nivelSugerido = destino.nivelIdiomaRequerido ?? 'B2';
      const perfilHipotetico: PerfilParaComparar = {
        idiomasDominados: [...perfil.idiomasDominados, { idioma: destino.idiomaRequerido, nivel: nivelSugerido }],
      };
      const hipotetico = calcularPuntuaciones(perfilHipotetico, [destino], reglas)[0];
      const impacto = hipotetico.porcentajeCompatibilidad - actual.porcentajeCompatibilidad;
      if (impacto > 0) {
        acciones.push({
          criterio: 'barrera_idioma',
          descripcionAccion: `Aprender ${destino.idiomaRequerido} a nivel ${nivelSugerido} y registrarlo en tu perfil`,
          impactoEstimadoPuntos: impacto,
          porcentajeResultanteEstimado: hipotetico.porcentajeCompatibilidad,
        });
      }
    }
  }

  return acciones.sort((a, b) => b.impactoEstimadoPuntos - a.impactoEstimadoPuntos);
}
