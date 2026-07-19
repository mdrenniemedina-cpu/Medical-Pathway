import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { DomainEventHandler, EventBusPort } from '@shared-kernel/application/event-bus.port';

/**
 * Implementación in-process del bus de eventos (ADR-015): suficiente para un
 * monolito modular en esta etapa. Los suscriptores viven en el mismo proceso
 * (p. ej. el Anti-Corruption Layer de Radar de Espera escuchando
 * `EntroAEtapaDeEspera`). Si en el futuro un contexto se extrae a un servicio
 * independiente, esta clase es el único punto que cambiaría por un cliente de
 * broker real (Kafka/SQS/etc.) — ningún bounded context depende de esta clase
 * directamente, todos dependen de `EventBusPort`.
 */
@Injectable()
export class InProcessEventBus implements EventBusPort {
  private readonly logger = new Logger(InProcessEventBus.name);
  private readonly handlers = new Map<string, DomainEventHandler[]>();

  subscribe<E extends DomainEvent>(eventName: string, handler: DomainEventHandler<E>): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler as DomainEventHandler);
    this.handlers.set(eventName, existing);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        // Un handler que falla no debe tumbar el despacho del outbox completo;
        // queda registrado para investigación manual (ver observabilidad).
        this.logger.error(
          `Fallo al procesar el evento ${event.eventName} (aggregateId=${event.aggregateId}): ${(error as Error).message}`,
        );
      }
    }
  }
}
