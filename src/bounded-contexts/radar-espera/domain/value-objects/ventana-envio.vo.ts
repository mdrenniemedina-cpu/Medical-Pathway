import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

interface VentanaEnvioProps {
  anio: number;
  trimestre: 1 | 2 | 3 | 4;
}

/**
 * Granularidad deliberada (mes/trimestre, NUNCA fecha exacta) — decisión de
 * privacidad por diseño: una fecha exacta facilitaría re-identificar a un
 * usuario dentro de una cohorte pequeña. Ver `decisions/ADR-008` y
 * `13-calidad-confianza-datos-radar.md`.
 */
export class VentanaEnvio extends ValueObject<VentanaEnvioProps> {
  static crear(anio: number, trimestre: number): VentanaEnvio {
    if (trimestre < 1 || trimestre > 4) {
      throw new DomainError('El trimestre debe estar entre 1 y 4.', 'TRIMESTRE_INVALIDO');
    }
    if (anio < 2020 || anio > new Date().getFullYear() + 1) {
      throw new DomainError('El año de la ventana de envío no es válido.', 'ANIO_INVALIDO');
    }
    return new VentanaEnvio({ anio, trimestre: trimestre as 1 | 2 | 3 | 4 });
  }

  get anio(): number {
    return this.props.anio;
  }
  get trimestre(): number {
    return this.props.trimestre;
  }

  etiqueta(): string {
    return `${this.props.anio}-Q${this.props.trimestre}`;
  }
}
