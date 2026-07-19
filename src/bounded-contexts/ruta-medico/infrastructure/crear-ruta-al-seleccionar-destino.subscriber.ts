import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { EVENT_BUS, EventBusPort } from '@shared-kernel/application/event-bus.port';
import { DestinoSeleccionadoEvent, DestinoSeleccionadoPayload } from '@contexts/descubrimiento/public-api';
import { CrearRutaPersonalizadaUseCase } from '../application/crear-ruta-personalizada.use-case';

/**
 * Customer-Supplier: reacciona al evento publicado por Descubrimiento cuando
 * el usuario elige un destino. Solo importa el nombre del evento y su tipo
 * de payload desde `@contexts/descubrimiento/public-api` — nunca el
 * agregado `ResultadoDescubrimiento`.
 */
@Injectable()
export class CrearRutaAlSeleccionarDestinoSubscriber implements OnModuleInit {
  private readonly logger = new Logger(CrearRutaAlSeleccionarDestinoSubscriber.name);

  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
    private readonly crearRuta: CrearRutaPersonalizadaUseCase,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DestinoSeleccionadoEvent.EVENT_NAME, async (event: DomainEvent) => {
      const payload = event.payload as unknown as DestinoSeleccionadoPayload;
      try {
        await this.crearRuta.ejecutar(payload.perfilId, payload.destinoId);
      } catch (error) {
        this.logger.error(
          `No se pudo crear la ruta personalizada para perfil=${payload.perfilId} destino=${payload.destinoId}: ${(error as Error).message}`,
        );
      }
    });
  }
}
