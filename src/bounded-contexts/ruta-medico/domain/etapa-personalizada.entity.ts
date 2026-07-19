import { Entity } from '@shared-kernel/domain/entity.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { DocumentoAsociado } from './documento-asociado.vo';

export type EstadoEtapa = 'pendiente' | 'en_curso' | 'completada' | 'omitida';
export type TipoEtapaPersonalizada = 'documental' | 'examen' | 'espera' | 'registro';

export interface EtapaPersonalizadaProps {
  id: string;
  etapaRutaId: string;
  orden: number;
  nombre: string;
  tipo: TipoEtapaPersonalizada;
  estado: EstadoEtapa;
  obligatoria: boolean;
  prerequisitoEtapaPersonalizadaId?: string;
  documentos: DocumentoAsociado[];
}

export class EtapaPersonalizada extends Entity {
  private constructor(private props: EtapaPersonalizadaProps) {
    super(props.id);
  }

  static crear(props: EtapaPersonalizadaProps): EtapaPersonalizada {
    return new EtapaPersonalizada(props);
  }

  /** Invariante: no se puede completar una etapa cuyo prerequisito no esté completa (validado por el agregado padre, que conoce a todas las etapas hermanas). */
  marcarEnCurso(): void {
    if (this.props.estado === 'completada') {
      throw new DomainError('No se puede reabrir una etapa ya completada.', 'ETAPA_YA_COMPLETADA');
    }
    this.props.estado = 'en_curso';
  }

  marcarCompletada(): void {
    this.props.estado = 'completada';
  }

  get etapaRutaId(): string {
    return this.props.etapaRutaId;
  }
  get orden(): number {
    return this.props.orden;
  }
  get nombre(): string {
    return this.props.nombre;
  }
  get tipo(): TipoEtapaPersonalizada {
    return this.props.tipo;
  }
  get estado(): EstadoEtapa {
    return this.props.estado;
  }
  get obligatoria(): boolean {
    return this.props.obligatoria;
  }
  get prerequisitoEtapaPersonalizadaId(): string | undefined {
    return this.props.prerequisitoEtapaPersonalizadaId;
  }
  get documentos(): readonly DocumentoAsociado[] {
    return this.props.documentos;
  }

  esDeTipoEspera(): boolean {
    return this.props.tipo === 'espera';
  }
}
