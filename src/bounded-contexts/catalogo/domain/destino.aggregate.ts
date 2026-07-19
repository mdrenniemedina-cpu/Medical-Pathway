import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { AtributoConFuente } from './value-objects/atributo-con-fuente.vo';

export type NivelDemanda = 'baja' | 'media' | 'alta' | 'muy_alta';
export type DificultadRelativa = 'baja' | 'media' | 'alta' | 'muy_alta';

export interface DestinoProps {
  id: string;
  nombre: string;
  codigoIso: string;
  idiomaRequerido: string | null; // null = sin barrera de idioma (España, para hispanohablantes)
  nivelIdiomaRequerido: string | null;
  tiempoTipicoMeses: AtributoConFuente<number>;
  costeTipico: AtributoConFuente<{ valor: number; moneda: string }>;
  nivelDemanda: AtributoConFuente<NivelDemanda>;
  dificultadRelativa: AtributoConFuente<DificultadRelativa>;
  complejidadRegulatoria: AtributoConFuente<DificultadRelativa>;
  localeDefault: string;
}

/**
 * Ningún campo de hecho es un primitivo suelto — todos son `AtributoConFuente`
 * (ver esa clase para la invariante forzada). `Destino` no conoce a
 * Descubrimiento ni a Ruta del Médico: ambos lo consumen vía la public-api
 * de este contexto (Open Host Service).
 */
export class Destino extends AggregateRoot {
  private constructor(private props: DestinoProps) {
    super(props.id);
  }

  static crear(props: DestinoProps): Destino {
    return new Destino(props);
  }

  get nombre(): string {
    return this.props.nombre;
  }
  get codigoIso(): string {
    return this.props.codigoIso;
  }
  get idiomaRequerido(): string | null {
    return this.props.idiomaRequerido;
  }
  get nivelIdiomaRequerido(): string | null {
    return this.props.nivelIdiomaRequerido;
  }
  get tiempoTipicoMeses(): AtributoConFuente<number> {
    return this.props.tiempoTipicoMeses;
  }
  get costeTipico(): AtributoConFuente<{ valor: number; moneda: string }> {
    return this.props.costeTipico;
  }
  get nivelDemanda(): AtributoConFuente<NivelDemanda> {
    return this.props.nivelDemanda;
  }
  get dificultadRelativa(): AtributoConFuente<DificultadRelativa> {
    return this.props.dificultadRelativa;
  }
  get complejidadRegulatoria(): AtributoConFuente<DificultadRelativa> {
    return this.props.complejidadRegulatoria;
  }
  get localeDefault(): string {
    return this.props.localeDefault;
  }
}
