import { ValueObject } from '@shared-kernel/domain/value-object.base';

interface DocumentoAsociadoProps {
  id: string;
  tipo: string;
  storageRefCifrada: string;
  fechaCarga: Date;
  fechaVencimiento?: Date;
}

export class DocumentoAsociado extends ValueObject<DocumentoAsociadoProps> {
  static crear(props: DocumentoAsociadoProps): DocumentoAsociado {
    return new DocumentoAsociado(props);
  }
  get id(): string {
    return this.props.id;
  }
  get tipo(): string {
    return this.props.tipo;
  }
  get fechaVencimiento(): Date | undefined {
    return this.props.fechaVencimiento;
  }
}
