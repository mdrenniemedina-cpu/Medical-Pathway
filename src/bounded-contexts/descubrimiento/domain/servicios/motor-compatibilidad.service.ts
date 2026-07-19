import { PuntuacionDestino } from '../value-objects/puntuacion-destino.vo';
import { Razon } from '../value-objects/razon.vo';
import { ReglaCompatibilidad } from '../regla-compatibilidad.entity';

/**
 * Forma mínima que el motor necesita de un perfil — deliberadamente NO es
 * `PerfilSnapshot` de Perfil Internacional ni `DestinoView` de Catálogo.
 * La traducción de esos tipos a estos ocurre en la capa de infraestructura
 * (`catalogo-acl.ts`, `perfil.translator.ts`) — el dominio de Descubrimiento
 * nunca importa nada de otro bounded context (ver ADR-010, ADR-012).
 */
export interface PerfilParaComparar {
  idiomasDominados: Array<{ idioma: string; nivel: string }>;
}

export interface DestinoParaComparar {
  destinoId: string;
  nombre: string;
  idiomaRequerido: string | null;
  nivelIdiomaRequerido: string | null;
  nivelDemanda: 'baja' | 'media' | 'alta' | 'muy_alta';
  tiempoTipicoMeses: number;
  complejidadRegulatoria: 'baja' | 'media' | 'alta' | 'muy_alta';
}

/** Criterios que el usuario puede cambiar cambiando su propio perfil — el resto son estructurales del destino (ver AnalizadorDeBrechas). */
export const CRITERIOS_ACCIONABLES_POR_PERFIL = ['barrera_idioma'] as const;

const NIVEL_A_PUNTOS: Record<string, number> = { baja: 10, media: 20, alta: 30, muy_alta: 40 };

/**
 * Motor de reglas determinista y explicable — NO es un modelo de IA/ML (ver
 * `decisions/ADR-002`). Cada ajuste de puntuación queda registrado como una
 * `Razon` legible. El peso de cada regla es dato (`ReglaCompatibilidad`),
 * no código — permite ajustar el motor sin desplegar, mientras se mantiene
 * 100% auditable.
 */
export function calcularPuntuaciones(
  perfil: PerfilParaComparar,
  destinos: DestinoParaComparar[],
  reglas: ReglaCompatibilidad[],
): PuntuacionDestino[] {
  const pesoIdioma = reglas.find((r) => r.atributoDestino === 'idioma_requerido')?.peso ?? 1;
  const pesoDemanda = reglas.find((r) => r.atributoDestino === 'nivel_demanda')?.peso ?? 1;
  const pesoTiempo = reglas.find((r) => r.atributoDestino === 'tiempo_tipico_meses')?.peso ?? 1;
  const pesoComplejidad = reglas.find((r) => r.atributoDestino === 'complejidad_regulatoria')?.peso ?? 1;

  return destinos.map((destino) => {
    const razones: Razon[] = [];
    let total = 40; // base neutral

    // --- barrera de idioma ---
    if (!destino.idiomaRequerido) {
      const aporte = 30 * pesoIdioma;
      total += aporte;
      razones.push(Razon.crear('barrera_idioma', aporte, `Sin barrera de idioma para ${destino.nombre}.`));
    } else {
      const dominado = perfil.idiomasDominados.find((i) => i.idioma === destino.idiomaRequerido);
      if (dominado) {
        const aporte = 15 * pesoIdioma;
        total += aporte;
        razones.push(Razon.crear('barrera_idioma', aporte, `Ya tienes un nivel de ${destino.idiomaRequerido} registrado en tu perfil.`));
      } else {
        const aporte = -25 * pesoIdioma;
        total += aporte;
        razones.push(
          Razon.crear(
            'barrera_idioma',
            aporte,
            `${destino.nombre} requiere ${destino.idiomaRequerido}; no tienes ese idioma registrado en tu perfil.`,
          ),
        );
      }
    }

    // --- demanda laboral (centrada en 'media'=20: por debajo penaliza, por encima premia) ---
    const aporteDemandaRedondeado = Math.round(((NIVEL_A_PUNTOS[destino.nivelDemanda] ?? 20) - 20) * pesoDemanda * 0.5);
    total += aporteDemandaRedondeado;
    razones.push(
      Razon.crear(
        'demanda_laboral',
        aporteDemandaRedondeado,
        `Nivel de demanda laboral: ${destino.nivelDemanda.replace('_', ' ')}.`,
      ),
    );

    // --- tiempo de espera (penaliza tiempos largos) ---
    if (destino.tiempoTipicoMeses > 12) {
      const aporte = -Math.round(Math.min(destino.tiempoTipicoMeses / 3, 10) * pesoTiempo);
      total += aporte;
      razones.push(
        Razon.crear('tiempo_espera', aporte, `El tiempo típico de espera es elevado (${destino.tiempoTipicoMeses} meses).`),
      );
    }

    // --- complejidad regulatoria ---
    if (destino.complejidadRegulatoria === 'alta' || destino.complejidadRegulatoria === 'muy_alta') {
      const aporte = -Math.round(10 * pesoComplejidad);
      total += aporte;
      razones.push(
        Razon.crear('complejidad_regulatoria', aporte, `La complejidad regulatoria de ${destino.nombre} es ${destino.complejidadRegulatoria}.`),
      );
    }

    const porcentaje = Math.max(0, Math.min(100, Math.round(total)));
    return PuntuacionDestino.crear(destino.destinoId, porcentaje, razones);
  });
}
