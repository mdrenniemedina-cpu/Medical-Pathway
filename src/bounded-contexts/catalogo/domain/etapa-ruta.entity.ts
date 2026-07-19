import { Entity } from '@shared-kernel/domain/entity.base';
import { AtributoConFuente } from './value-objects/atributo-con-fuente.vo';

export type TipoEtapa = 'documental' | 'examen' | 'espera' | 'registro';

export interface EtapaRutaProps {
  id: string;
  orden: number;
  nombre: string;
  descripcion: string;
  tipo: TipoEtapa;
  duracionTipicaDias: AtributoConFuente<number>;
  esConfigurablePorPerfil: boolean;
  prerequisitoEtapaId?: string;
}

export class EtapaRuta extends Entity {
  private constructor(private props: EtapaRutaProps) {
    super(props.id);
  }

  static crear(props: EtapaRutaProps): EtapaRuta {
    return new EtapaRuta(props);
  }

  get orden(): number {
    return this.props.orden;
  }
  get nombre(): string {
    return this.props.nombre;
  }
  get tipo(): TipoEtapa {
    return this.props.tipo;
  }
  get duracionTipicaDias(): AtributoConFuente<number> {
    return this.props.duracionTipicaDias;
  }
  get esConfigurablePorPerfil(): boolean {
    return this.props.esConfigurablePorPerfil;
  }
  get prerequisitoEtapaId(): string | undefined {
    return this.props.prerequisitoEtapaId;
  }

  esDeTipoEspera(): boolean {
    return this.props.tipo === 'espera';
  }
}
