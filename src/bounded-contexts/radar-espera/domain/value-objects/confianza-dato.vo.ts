import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

interface ConfianzaDatoProps {
  puntaje: number; // 0..1
}

/**
 * Ver `decisions/ADR-013` y `13-calidad-confianza-datos-radar.md`. Nunca se
 * expone el puntaje individual de un usuario a otros usuarios — solo
 * alimenta agregados ponderados (ver `CohorteDeComparacion`).
 */
export class ConfianzaDato extends ValueObject<ConfianzaDatoProps> {
  static crear(puntaje: number): ConfianzaDato {
    if (puntaje < 0 || puntaje > 1) {
      throw new DomainError('La confianza del dato debe estar entre 0 y 1.', 'CONFIANZA_FUERA_DE_RANGO');
    }
    return new ConfianzaDato({ puntaje });
  }

  get puntaje(): number {
    return this.props.puntaje;
  }

  esConfiable(umbral = 0.5): boolean {
    return this.props.puntaje >= umbral;
  }
}
