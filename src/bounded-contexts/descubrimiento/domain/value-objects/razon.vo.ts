import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

interface RazonProps {
  criterio: string;
  aportePuntos: number;
  explicacionLegible: string;
}

export class Razon extends ValueObject<RazonProps> {
  static crear(criterio: string, aportePuntos: number, explicacionLegible: string): Razon {
    if (!explicacionLegible?.trim()) {
      throw new DomainError(
        'Toda razón debe tener una explicación legible para el usuario.',
        'RAZON_SIN_EXPLICACION',
      );
    }
    return new Razon({ criterio, aportePuntos, explicacionLegible });
  }

  get criterio(): string {
    return this.props.criterio;
  }
  get aportePuntos(): number {
    return this.props.aportePuntos;
  }
  get explicacionLegible(): string {
    return this.props.explicacionLegible;
  }
}
