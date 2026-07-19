import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { EVENT_BUS, EventBusPort } from '@shared-kernel/application/event-bus.port';
import { PerfilActualizadoEvent } from '@contexts/perfil-internacional/public-api';
import { RutaHomologacionActualizadaEvent } from '@contexts/catalogo/public-api';

/**
 * Esqueleto deliberado (Sprint 0): demuestra el patrón Conformist descrito en
 * `05-domain-model-ddd.md` §11 — Notificaciones se suscribe a eventos de
 * otros contextos sin imponerles su propio modelo. En este sprint solo
 * registra el evento (log estructurado); la generación de `Alerta`
 * personalizada cruzando `PreferenciaDeNotificacion` + `PerfilSnapshot` es
 * lógica de un sprint posterior (ver `03-mvp-definition.md`).
 */
@Injectable()
export class RegistrarEventosSubscriber implements OnModuleInit {
  private readonly logger = new Logger(RegistrarEventosSubscriber.name);

  constructor(@Inject(EVENT_BUS) private readonly eventBus: EventBusPort) {}

  onModuleInit(): void {
    const registrar = (event: DomainEvent) =>
      Promise.resolve(
        this.logger.log(`Evento recibido: ${event.eventName} (aggregateId=${event.aggregateId})`),
      );

    this.eventBus.subscribe(PerfilActualizadoEvent.EVENT_NAME, registrar);
    this.eventBus.subscribe(RutaHomologacionActualizadaEvent.EVENT_NAME, registrar);
  }
}
