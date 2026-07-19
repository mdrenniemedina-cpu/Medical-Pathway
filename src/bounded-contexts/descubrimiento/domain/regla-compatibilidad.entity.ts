import { Entity } from '@shared-kernel/domain/entity.base';

export interface ReglaCompatibilidadProps {
  id: string;
  atributoPerfil: string;
  atributoDestino: string;
  peso: number;
  version: number;
  activa: boolean;
}

/**
 * Reglas versionadas y editables por el equipo de producto — NO es un
 * modelo entrenado. Auditable: se puede leer exactamente por qué un destino
 * recibió +25 o -8 puntos. Ver `decisions/ADR-002` y `04-architecture.md`
 * ("Motor de Descubrimiento — cómo funciona").
 */
export class ReglaCompatibilidad extends Entity {
  private constructor(private props: ReglaCompatibilidadProps) {
    super(props.id);
  }

  static crear(props: ReglaCompatibilidadProps): ReglaCompatibilidad {
    return new ReglaCompatibilidad(props);
  }

  get atributoPerfil(): string {
    return this.props.atributoPerfil;
  }
  get atributoDestino(): string {
    return this.props.atributoDestino;
  }
  get peso(): number {
    return this.props.peso;
  }
  get version(): number {
    return this.props.version;
  }
  get activa(): boolean {
    return this.props.activa;
  }
}
