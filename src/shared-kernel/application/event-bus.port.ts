import { DomainEvent } from '../domain/domain-event.base';

export type DomainEventHandler<E extends DomainEvent = DomainEvent> = (event: E) => Promise<void>;

/**
 * Puerto (interfaz) del bus de eventos. La implementación concreta (in-process,
 * ver src/infrastructure/events) es infraestructura; el dominio y la aplicación
 * solo conocen este contrato. Cambiar la implementación (p. ej. a un broker
 * distribuido si el monolito se descompone algún día) no debería tocar ningún
 * bounded context — ver ADR-015.
 */
export interface EventBusPort {
  subscribe<E extends DomainEvent>(eventName: string, handler: DomainEventHandler<E>): void;
  publish(event: DomainEvent): Promise<void>;
}

export const EVENT_BUS = Symbol('EVENT_BUS');
