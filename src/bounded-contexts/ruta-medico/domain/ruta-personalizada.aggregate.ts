import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { EtapaPersonalizada } from './etapa-personalizada.entity';
import { EntroAEtapaDeEsperaEvent, EtapaCompletadaEvent, EtapaIniciadaEvent } from './events/ruta-medico-eventos';

export interface RutaPersonalizadaProps {
  id: string;
  perfilId: string;
  destinoId: string;
  rutaHomologacionId: string;
  region?: string;
  activa: boolean;
  etapas: EtapaPersonalizada[];
}

export class RutaPersonalizada extends AggregateRoot {
  private constructor(private props: RutaPersonalizadaProps) {
    super(props.id);
  }

  static crear(
    id: string,
    perfilId: string,
    destinoId: string,
    rutaHomologacionId: string,
    etapas: EtapaPersonalizada[],
  ): RutaPersonalizada {
    if (etapas.length === 0) {
      throw new DomainError('Una ruta personalizada debe tener al menos una etapa.', 'RUTA_PERSONALIZADA_SIN_ETAPAS');
    }
    return new RutaPersonalizada({ id, perfilId, destinoId, rutaHomologacionId, activa: true, etapas });
  }

  static reconstituir(props: RutaPersonalizadaProps): RutaPersonalizada {
    return new RutaPersonalizada(props);
  }

  iniciarEtapa(etapaId: string): void {
    const etapa = this.requerirEtapa(etapaId);
    if (etapa.prerequisitoEtapaPersonalizadaId) {
      const prereq = this.requerirEtapa(etapa.prerequisitoEtapaPersonalizadaId);
      if (prereq.estado !== 'completada') {
        throw new DomainError(
          'No se puede iniciar esta etapa: su prerequisito aún no está completado.',
          'PREREQUISITO_NO_COMPLETADO',
        );
      }
    }
    etapa.marcarEnCurso();
    this.raise(new EtapaIniciadaEvent(this.id, etapaId));

    if (etapa.esDeTipoEspera()) {
      this.raise(
        new EntroAEtapaDeEsperaEvent(this.id, {
          perfilId: this.props.perfilId,
          destinoId: this.props.destinoId,
          rutaHomologacionId: this.props.rutaHomologacionId,
          region: this.props.region,
        }),
      );
    }
  }

  completarEtapa(etapaId: string): void {
    const etapa = this.requerirEtapa(etapaId);
    if (etapa.prerequisitoEtapaPersonalizadaId) {
      const prereq = this.requerirEtapa(etapa.prerequisitoEtapaPersonalizadaId);
      if (prereq.estado !== 'completada') {
        throw new DomainError(
          'No se puede completar esta etapa: su prerequisito aún no está completado.',
          'PREREQUISITO_NO_COMPLETADO',
        );
      }
    }
    etapa.marcarCompletada();
    this.raise(new EtapaCompletadaEvent(this.id, etapaId));
  }

  private requerirEtapa(etapaId: string): EtapaPersonalizada {
    const etapa = this.props.etapas.find((e) => e.id === etapaId);
    if (!etapa) throw new DomainError('Etapa no encontrada en esta ruta personalizada.', 'ETAPA_NO_ENCONTRADA');
    return etapa;
  }

  get perfilId(): string {
    return this.props.perfilId;
  }
  get destinoId(): string {
    return this.props.destinoId;
  }
  get rutaHomologacionId(): string {
    return this.props.rutaHomologacionId;
  }
  get etapas(): readonly EtapaPersonalizada[] {
    return [...this.props.etapas].sort((a, b) => a.orden - b.orden);
  }
}
