import { ValueObject } from '@shared-kernel/domain/value-object.base';

interface TipoExpedienteProps {
  destinoId: string;
  rutaHomologacionId: string;
  region?: string;
  especialidad?: string;
}

export class TipoExpediente extends ValueObject<TipoExpedienteProps> {
  static crear(props: TipoExpedienteProps): TipoExpediente {
    return new TipoExpediente(props);
  }
  get destinoId(): string {
    return this.props.destinoId;
  }
  get rutaHomologacionId(): string {
    return this.props.rutaHomologacionId;
  }
  get region(): string | undefined {
    return this.props.region;
  }
  get especialidad(): string | undefined {
    return this.props.especialidad;
  }
}
