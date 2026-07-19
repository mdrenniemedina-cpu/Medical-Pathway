import { IntegrationEvent } from '@shared-kernel/domain/domain-event.base';

export class RutaHomologacionPublicadaEvent extends IntegrationEvent<{ destinoId: string }> {
  static readonly EVENT_NAME = 'catalogo.RutaHomologacionPublicada';
  constructor(rutaId: string, destinoId: string) {
    super(RutaHomologacionPublicadaEvent.EVENT_NAME, rutaId, { destinoId });
  }
}

export class RutaHomologacionActualizadaEvent extends IntegrationEvent<{ destinoId: string; version: number }> {
  static readonly EVENT_NAME = 'catalogo.RutaHomologacionActualizada';
  constructor(rutaId: string, destinoId: string, version: number) {
    super(RutaHomologacionActualizadaEvent.EVENT_NAME, rutaId, { destinoId, version });
  }
}
