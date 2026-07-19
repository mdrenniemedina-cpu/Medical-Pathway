import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { Razon } from './razon.vo';

interface PuntuacionDestinoProps {
  destinoId: string;
  porcentajeCompatibilidad: number;
  razones: Razon[];
}

/**
 * INVARIANTE CENTRAL DE DESCUBRIMIENTO (ver `05-domain-model-ddd.md` §6 y
 * `decisions/ADR-002`): es imposible construir una puntuación sin al menos
 * una razón. Es la traducción literal a código de "no quiero vender un
 * comparador, quiero vender claridad" — no hay forma de que el sistema
 * emita un porcentaje sin explicación, ni siquiera por error de
 * programación futuro. Ver `test/architecture/invariantes.descubrimiento.spec.ts`.
 */
export class PuntuacionDestino extends ValueObject<PuntuacionDestinoProps> {
  static crear(destinoId: string, porcentajeCompatibilidad: number, razones: Razon[]): PuntuacionDestino {
    if (razones.length === 0) {
      throw new DomainError(
        'No se puede crear una puntuación de compatibilidad sin al menos una razón explicativa.',
        'PUNTUACION_SIN_RAZONES',
      );
    }
    if (porcentajeCompatibilidad < 0 || porcentajeCompatibilidad > 100) {
      throw new DomainError('El porcentaje de compatibilidad debe estar entre 0 y 100.', 'PORCENTAJE_FUERA_DE_RANGO');
    }
    return new PuntuacionDestino({ destinoId, porcentajeCompatibilidad, razones });
  }

  get destinoId(): string {
    return this.props.destinoId;
  }
  get porcentajeCompatibilidad(): number {
    return this.props.porcentajeCompatibilidad;
  }
  get razones(): readonly Razon[] {
    return this.props.razones;
  }
}
