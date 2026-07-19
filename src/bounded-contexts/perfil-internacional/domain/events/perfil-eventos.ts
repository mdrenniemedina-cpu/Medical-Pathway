import { IntegrationEvent } from '@shared-kernel/domain/domain-event.base';

/**
 * Los tres eventos publicados por Perfil Internacional (Open Host Service,
 * ver `05-domain-model-ddd.md` §4). Descubrimiento, Notificaciones y
 * Comunidad se suscriben a `PerfilActualizado` sin que Perfil Internacional
 * conozca a ninguno de sus consumidores.
 */

export interface PerfilSnapshotPayload extends Record<string, unknown> {
  cuentaId: string;
  nivelVerificacion: string;
}

export class PerfilCreadoEvent extends IntegrationEvent<PerfilSnapshotPayload> {
  static readonly EVENT_NAME = 'perfil.PerfilCreado';
  constructor(perfilId: string, payload: PerfilSnapshotPayload) {
    super(PerfilCreadoEvent.EVENT_NAME, perfilId, payload);
  }
}

export class PerfilActualizadoEvent extends IntegrationEvent<PerfilSnapshotPayload> {
  static readonly EVENT_NAME = 'perfil.PerfilActualizado';
  constructor(perfilId: string, payload: PerfilSnapshotPayload) {
    super(PerfilActualizadoEvent.EVENT_NAME, perfilId, payload);
  }
}

export class NivelDeVerificacionElevadoEvent extends IntegrationEvent<{ nivelAnterior: string; nivelNuevo: string }> {
  static readonly EVENT_NAME = 'perfil.NivelDeVerificacionElevado';
  constructor(perfilId: string, nivelAnterior: string, nivelNuevo: string) {
    super(NivelDeVerificacionElevadoEvent.EVENT_NAME, perfilId, { nivelAnterior, nivelNuevo });
  }
}
