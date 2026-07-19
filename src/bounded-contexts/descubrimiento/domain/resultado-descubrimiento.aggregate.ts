import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { PuntuacionDestino } from './value-objects/puntuacion-destino.vo';
import { DescubrimientoCompletadoEvent, DestinoSeleccionadoEvent } from './events/descubrimiento-eventos';

export interface ResultadoDescubrimientoProps {
  id: string;
  perfilId: string;
  reglasVersion: number;
  generadoEn: Date;
  puntuaciones: PuntuacionDestino[];
  destinoSeleccionadoId?: string;
}

/**
 * Guarda un snapshot inmutable de `reglasVersion` para poder explicar, más
 * adelante, "por qué te recomendamos esto en su momento" aunque las reglas
 * cambien después (ver `05-domain-model-ddd.md` §6).
 */
export class ResultadoDescubrimiento extends AggregateRoot {
  private constructor(private props: ResultadoDescubrimientoProps) {
    super(props.id);
  }

  static crear(id: string, perfilId: string, reglasVersion: number, puntuaciones: PuntuacionDestino[]): ResultadoDescubrimiento {
    if (puntuaciones.length === 0) {
      throw new DomainError('Un resultado de descubrimiento debe tener al menos una puntuación.', 'RESULTADO_SIN_PUNTUACIONES');
    }
    const resultado = new ResultadoDescubrimiento({ id, perfilId, reglasVersion, generadoEn: new Date(), puntuaciones });
    const top = [...puntuaciones].sort((a, b) => b.porcentajeCompatibilidad - a.porcentajeCompatibilidad)[0];
    resultado.raise(
      new DescubrimientoCompletadoEvent(id, {
        perfilId,
        reglasVersion,
        destinoTopId: top.destinoId,
        destinoTopPorcentaje: top.porcentajeCompatibilidad,
      }),
    );
    return resultado;
  }

  static reconstituir(props: ResultadoDescubrimientoProps): ResultadoDescubrimiento {
    return new ResultadoDescubrimiento(props);
  }

  seleccionarDestino(destinoId: string): void {
    const existe = this.props.puntuaciones.some((p) => p.destinoId === destinoId);
    if (!existe) {
      throw new DomainError('El destino seleccionado no forma parte de este resultado.', 'DESTINO_NO_EN_RESULTADO');
    }
    this.props.destinoSeleccionadoId = destinoId;
    this.raise(
      new DestinoSeleccionadoEvent(this.props.perfilId, {
        perfilId: this.props.perfilId,
        destinoId,
        resultadoId: this.id,
      }),
    );
  }

  get perfilId(): string {
    return this.props.perfilId;
  }
  get reglasVersion(): number {
    return this.props.reglasVersion;
  }
  get generadoEn(): Date {
    return this.props.generadoEn;
  }
  get puntuaciones(): readonly PuntuacionDestino[] {
    return [...this.props.puntuaciones].sort((a, b) => b.porcentajeCompatibilidad - a.porcentajeCompatibilidad);
  }
  get destinoSeleccionadoId(): string | undefined {
    return this.props.destinoSeleccionadoId;
  }
}
