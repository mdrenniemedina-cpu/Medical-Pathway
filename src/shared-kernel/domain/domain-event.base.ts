/**
 * Todo evento de dominio (interno a un contexto) y todo evento de integración
 * (publicado hacia otros contextos vía outbox) extiende esta base. Ver ADR-015.
 */
export abstract class DomainEvent<Payload extends Record<string, unknown> = Record<string, unknown>> {
  readonly occurredAt: Date;

  protected constructor(
    public readonly eventName: string,
    public readonly aggregateId: string,
    public readonly payload: Payload,
  ) {
    this.occurredAt = new Date();
  }
}

/**
 * Marca los eventos que cruzan un límite de bounded context (Published Language).
 * Solo estos se escriben en el outbox; un evento de dominio puramente interno
 * a un agregado no necesita serializarse ni publicarse.
 */
export abstract class IntegrationEvent<
  Payload extends Record<string, unknown> = Record<string, unknown>,
> extends DomainEvent<Payload> {
  protected constructor(eventName: string, aggregateId: string, payload: Payload) {
    super(eventName, aggregateId, payload);
  }
}
