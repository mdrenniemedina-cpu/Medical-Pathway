import { DomainEvent } from '@shared-kernel/domain/domain-event.base';

/**
 * Envoltorio genérico usado únicamente por el despachador de outbox para
 * reconstruir, desde una fila de `shared.outbox_event`, un objeto compatible
 * con `EventBusPort.publish`. Los suscriptores identifican el evento por
 * `eventName` (string estable, parte del "Published Language" del contexto
 * emisor) y leen `payload` — no dependen de la clase original del emisor.
 */
export class GenericIntegrationEvent extends DomainEvent {
  constructor(eventName: string, aggregateId: string, payload: Record<string, unknown>) {
    super(eventName, aggregateId, payload);
  }
}
