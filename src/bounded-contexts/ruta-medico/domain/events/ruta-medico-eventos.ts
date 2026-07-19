import { IntegrationEvent } from '@shared-kernel/domain/domain-event.base';

export class EtapaIniciadaEvent extends IntegrationEvent<{ etapaPersonalizadaId: string }> {
  static readonly EVENT_NAME = 'ruta_medico.EtapaIniciada';
  constructor(rutaPersonalizadaId: string, etapaPersonalizadaId: string) {
    super(EtapaIniciadaEvent.EVENT_NAME, rutaPersonalizadaId, { etapaPersonalizadaId });
  }
}

export class EtapaCompletadaEvent extends IntegrationEvent<{ etapaPersonalizadaId: string }> {
  static readonly EVENT_NAME = 'ruta_medico.EtapaCompletada';
  constructor(rutaPersonalizadaId: string, etapaPersonalizadaId: string) {
    super(EtapaCompletadaEvent.EVENT_NAME, rutaPersonalizadaId, { etapaPersonalizadaId });
  }
}

export interface EntroAEtapaDeEsperaPayload extends Record<string, unknown> {
  perfilId: string;
  destinoId: string;
  rutaHomologacionId: string;
  region?: string;
}

/**
 * EL EVENTO MÁS IMPORTANTE de este contexto hacia el resto del sistema — es
 * el único punto de integración con Radar de Espera (ver `05-domain-model-ddd.md`
 * §7 y §8, y `decisions/ADR-012`). Deliberadamente NO menciona "España" ni
 * "homologación" en su forma — solo `destinoId`/`rutaHomologacionId`/`region`,
 * genéricos, para que activar el Radar sobre la espera de otro destino (p.
 * ej. Alemania) en el futuro no requiera cambiar este evento.
 */
export class EntroAEtapaDeEsperaEvent extends IntegrationEvent<EntroAEtapaDeEsperaPayload> {
  static readonly EVENT_NAME = 'ruta_medico.EntroAEtapaDeEspera';
  constructor(rutaPersonalizadaId: string, payload: EntroAEtapaDeEsperaPayload) {
    super(EntroAEtapaDeEsperaEvent.EVENT_NAME, rutaPersonalizadaId, payload);
  }
}
