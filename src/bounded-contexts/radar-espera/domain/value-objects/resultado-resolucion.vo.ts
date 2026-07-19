import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

export type EstadoResolucion = 'pendiente' | 'aprobado' | 'subsanacion' | 'rechazado';

interface ResultadoResolucionProps {
  estado: EstadoResolucion;
  fechaResolucion?: Date;
}

export class ResultadoResolucion extends ValueObject<ResultadoResolucionProps> {
  static pendiente(): ResultadoResolucion {
    return new ResultadoResolucion({ estado: 'pendiente' });
  }

  static resuelto(estado: Exclude<EstadoResolucion, 'pendiente'>, fechaResolucion: Date, fechaEnvioReferencia: Date): ResultadoResolucion {
    if (fechaResolucion.getTime() < fechaEnvioReferencia.getTime()) {
      throw new DomainError(
        'La fecha de resolución no puede ser anterior a la ventana de envío del expediente.',
        'FECHA_RESOLUCION_ANTERIOR_A_ENVIO',
      );
    }
    if (fechaResolucion.getTime() > Date.now()) {
      throw new DomainError('La fecha de resolución no puede ser futura.', 'FECHA_RESOLUCION_FUTURA');
    }
    return new ResultadoResolucion({ estado, fechaResolucion });
  }

  get estado(): EstadoResolucion {
    return this.props.estado;
  }
  get fechaResolucion(): Date | undefined {
    return this.props.fechaResolucion;
  }
  get estaResuelto(): boolean {
    return this.props.estado !== 'pendiente';
  }
}
