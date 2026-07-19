import { IntegrationEvent } from '@shared-kernel/domain/domain-event.base';

export class RegistroDeExpedienteCreadoEvent extends IntegrationEvent<{ perfilId: string; destinoId: string }> {
  static readonly EVENT_NAME = 'radar_espera.RegistroDeExpedienteCreado';
  constructor(registroId: string, payload: { perfilId: string; destinoId: string }) {
    super(RegistroDeExpedienteCreadoEvent.EVENT_NAME, registroId, payload);
  }
}

export class RegistroDeExpedienteActualizadoEvent extends IntegrationEvent<{ estado: string }> {
  static readonly EVENT_NAME = 'radar_espera.RegistroDeExpedienteActualizado';
  constructor(registroId: string, payload: { estado: string }) {
    super(RegistroDeExpedienteActualizadoEvent.EVENT_NAME, registroId, payload);
  }
}

export class AnomaliaDetectadaEvent extends IntegrationEvent<{ motivo: string }> {
  static readonly EVENT_NAME = 'radar_espera.AnomaliaDetectada';
  constructor(registroId: string, motivo: string) {
    super(AnomaliaDetectadaEvent.EVENT_NAME, registroId, { motivo });
  }
}
