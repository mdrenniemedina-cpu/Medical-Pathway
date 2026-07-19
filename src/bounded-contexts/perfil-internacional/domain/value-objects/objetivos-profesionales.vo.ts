import { ValueObject } from '@shared-kernel/domain/value-object.base';

export type Urgencia = 'alta' | 'media' | 'baja';
export type ToleranciaExamen = 'prefiere_rapido_competitivo' | 'prefiere_lento_seguro';
export type PrioridadIngreso = 'ingreso_largo_plazo' | 'rapidez_de_practica';

interface ObjetivosProfesionalesProps {
  urgencia: Urgencia;
  toleranciaExamenCompetitivo: ToleranciaExamen;
  prioridadIngresoVsRapidez: PrioridadIngreso;
}

/**
 * Alimenta directamente al motor de Descubrimiento (ver bounded context
 * `descubrimiento`) — cambiar cualquiera de estos valores es lo que dispara
 * `PerfilActualizado` y, en consecuencia, un recálculo de compatibilidad.
 */
export class ObjetivosProfesionales extends ValueObject<ObjetivosProfesionalesProps> {
  static crear(props: ObjetivosProfesionalesProps): ObjetivosProfesionales {
    return new ObjetivosProfesionales(props);
  }

  get urgencia(): Urgencia {
    return this.props.urgencia;
  }

  get toleranciaExamenCompetitivo(): ToleranciaExamen {
    return this.props.toleranciaExamenCompetitivo;
  }

  get prioridadIngresoVsRapidez(): PrioridadIngreso {
    return this.props.prioridadIngresoVsRapidez;
  }
}
