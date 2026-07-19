import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { EtapaRuta } from './etapa-ruta.entity';
import { RutaHomologacionActualizadaEvent, RutaHomologacionPublicadaEvent } from './events/ruta-homologacion-eventos';

export interface RutaHomologacionProps {
  id: string;
  destinoId: string;
  nombre: string;
  publicada: boolean;
  version: number;
  etapas: EtapaRuta[];
}

/**
 * Invariante: no se puede publicar una ruta si alguna etapa carece de fuente
 * — se cumple transitivamente porque `EtapaRuta.duracionTipicaDias` es un
 * `AtributoConFuente`, que ya no puede construirse sin fuente. Aquí se
 * refuerza además que exista AL MENOS una etapa antes de publicar.
 */
export class RutaHomologacion extends AggregateRoot {
  private constructor(private props: RutaHomologacionProps) {
    super(props.id);
  }

  static crearBorrador(id: string, destinoId: string, nombre: string): RutaHomologacion {
    return new RutaHomologacion({ id, destinoId, nombre, publicada: false, version: 1, etapas: [] });
  }

  static reconstituir(props: RutaHomologacionProps): RutaHomologacion {
    return new RutaHomologacion(props);
  }

  agregarEtapa(etapa: EtapaRuta): void {
    if (this.props.publicada) {
      throw new DomainError(
        'No se puede modificar una ruta ya publicada; cree una nueva versión.',
        'RUTA_YA_PUBLICADA_NO_MODIFICABLE',
      );
    }
    this.props.etapas.push(etapa);
  }

  publicar(): void {
    if (this.props.etapas.length === 0) {
      throw new DomainError('No se puede publicar una ruta sin etapas.', 'RUTA_SIN_ETAPAS');
    }
    this.props.publicada = true;
    this.raise(new RutaHomologacionPublicadaEvent(this.id, this.props.destinoId));
  }

  nuevaVersion(): void {
    this.props.version += 1;
    this.raise(new RutaHomologacionActualizadaEvent(this.id, this.props.destinoId, this.props.version));
  }

  get destinoId(): string {
    return this.props.destinoId;
  }
  get nombre(): string {
    return this.props.nombre;
  }
  get publicada(): boolean {
    return this.props.publicada;
  }
  get version(): number {
    return this.props.version;
  }
  get etapas(): readonly EtapaRuta[] {
    return [...this.props.etapas].sort((a, b) => a.orden - b.orden);
  }

  etapaDeEspera(): EtapaRuta | undefined {
    return this.etapas.find((e) => e.esDeTipoEspera());
  }
}
