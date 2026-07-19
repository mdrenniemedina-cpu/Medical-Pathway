import { Entity } from './entity.base';
import { DomainEvent } from './domain-event.base';

/**
 * Todo agregado (Perfil Internacional, Destino, ResultadoDeDescubrimiento,
 * RutaPersonalizada, RegistroDeExpediente, ...) extiende esta base. Acumula
 * eventos de dominio durante su ciclo de vida; la capa de infraestructura
 * (repositorio) los recoge con `pullDomainEvents()` y los escribe en el
 * outbox dentro de la MISMA transacción que persiste el agregado (ADR-015)
 * — nunca se publican directamente desde el dominio.
 */
export abstract class AggregateRoot<Id extends string = string> extends Entity<Id> {
  private domainEvents: DomainEvent[] = [];

  protected raise(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
