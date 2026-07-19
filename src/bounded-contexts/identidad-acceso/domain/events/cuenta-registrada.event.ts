import { IntegrationEvent } from '@shared-kernel/domain/domain-event.base';

export interface CuentaRegistradaPayload extends Record<string, unknown> {
  email: string;
}

export class CuentaRegistradaEvent extends IntegrationEvent<CuentaRegistradaPayload> {
  static readonly EVENT_NAME = 'identidad.CuentaRegistrada';

  constructor(cuentaId: string, payload: CuentaRegistradaPayload) {
    super(CuentaRegistradaEvent.EVENT_NAME, cuentaId, payload);
  }
}
