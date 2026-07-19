import { ValueObject } from '@shared-kernel/domain/value-object.base';

export type RangoPresupuesto = 'bajo' | 'medio' | 'alto';

interface SituacionEconomicaProps {
  rangoPresupuesto: RangoPresupuesto;
  moneda: string;
}

export class SituacionEconomica extends ValueObject<SituacionEconomicaProps> {
  static crear(props: SituacionEconomicaProps): SituacionEconomica {
    return new SituacionEconomica(props);
  }

  get rangoPresupuesto(): RangoPresupuesto {
    return this.props.rangoPresupuesto;
  }

  get moneda(): string {
    return this.props.moneda;
  }
}
