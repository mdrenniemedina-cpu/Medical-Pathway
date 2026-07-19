# ADR-015: Outbox transaccional + bus de eventos in-process (no un broker distribuido)

## Estado
Aceptada

## Contexto
El monolito modular necesita propagar eventos de dominio entre bounded contexts (p. ej. `EntroAEtapaDeEspera` de Ruta del Médico hacia Radar de Espera) sin perderlos si el proceso falla justo después de persistir un cambio de estado, y sin acoplar los contextos entre sí mediante llamadas síncronas directas.

## Decisión
Cada agregado acumula eventos de dominio (`AggregateRoot.raise()`); el repositorio que lo persiste los escribe en la tabla `shared.outbox_event` **dentro de la misma transacción SQL** que el cambio de estado (`runInTransactionWithOutbox`). Un `OutboxDispatcherService` (sondeo periódico, `@Interval`) lee eventos no publicados y los entrega a un `EventBusPort` implementado in-process (`InProcessEventBus`), del cual se suscriben los demás contextos. No se introduce Kafka, RabbitMQ, SQS ni ningún broker externo en esta etapa.

## Alternativas consideradas
- **Publicar el evento directamente tras el commit (sin outbox):** rechazado — existe una ventana real donde el commit tiene éxito pero el proceso muere antes de publicar, perdiendo el evento silenciosamente (el problema clásico de "dual write").
- **Un broker de mensajería distribuido desde el día uno:** rechazado por el mismo argumento que ADR-004/ADR-010 — coste operativo desproporcionado para un monolito modular en etapa pre-PMF; el patrón Outbox + bus in-process ya resuelve la fiabilidad de entrega sin esa complejidad.

## Consecuencias
- Se gana: garantía de que ningún evento se pierde entre "guardar" y "notificar", sin infraestructura adicional que operar.
- Se sacrifica: latencia de propagación no instantánea (sondeo cada 2s) — aceptable para los casos de uso actuales (ningún flujo de usuario depende de propagación de evento en tiempo real).
- Revisar si el volumen de eventos crece lo suficiente para justificar reemplazar el sondeo por `LISTEN`/`NOTIFY` de Postgres, o si un contexto necesita escalar independientemente y justifica un broker real — el contrato `EventBusPort` es el único punto que cambiaría.
