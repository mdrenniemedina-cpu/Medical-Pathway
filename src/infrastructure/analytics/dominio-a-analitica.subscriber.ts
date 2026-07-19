import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { EVENT_BUS, EventBusPort } from '@shared-kernel/application/event-bus.port';
import {
  DescubrimientoCompletadoEvent,
  DescubrimientoCompletadoPayload,
  DestinoSeleccionadoEvent,
  DestinoSeleccionadoPayload,
} from '@contexts/descubrimiento/public-api';
import { EntroAEtapaDeEsperaEvent, EntroAEtapaDeEsperaPayload } from '@contexts/ruta-medico/public-api';
import { EventosProductoRepository } from './eventos-producto.repository';

/**
 * Traduce eventos de dominio REALES (server-truth, no dependen de que el
 * frontend dispare una llamada) a analítica de producto — ver H2/H3 en
 * `docs/16-hipotesis-sprint-1.md`. Es un consumidor más del bus de eventos,
 * igual que cualquier Anti-Corruption Layer entre contextos, salvo que este
 * vive en infraestructura transversal (no es un bounded context) porque no
 * modela ninguna regla de negocio — solo registra que algo ocurrió.
 */
@Injectable()
export class DominioAAnaliticaSubscriber implements OnModuleInit {
  private readonly logger = new Logger(DominioAAnaliticaSubscriber.name);

  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
    private readonly eventos: EventosProductoRepository,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(DescubrimientoCompletadoEvent.EVENT_NAME, async (event: DomainEvent) => {
      const payload = event.payload as unknown as DescubrimientoCompletadoPayload;
      await this.registrarSeguro('recomendacion_generada', payload.perfilId, {
        destinoTopId: payload.destinoTopId,
        destinoTopPorcentaje: payload.destinoTopPorcentaje,
        reglasVersion: payload.reglasVersion,
      });
    });

    this.eventBus.subscribe(DestinoSeleccionadoEvent.EVENT_NAME, async (event: DomainEvent) => {
      const payload = event.payload as unknown as DestinoSeleccionadoPayload;
      await this.registrarSeguro('inicio_de_ruta', payload.perfilId, { destinoId: payload.destinoId });
    });

    this.eventBus.subscribe(EntroAEtapaDeEsperaEvent.EVENT_NAME, async (event: DomainEvent) => {
      const payload = event.payload as unknown as EntroAEtapaDeEsperaPayload;
      await this.registrarSeguro('etapa_espera_alcanzada', payload.perfilId, { destinoId: payload.destinoId });
    });
  }

  private async registrarSeguro(tipoEvento: string, perfilId: string, propiedades: Record<string, unknown>): Promise<void> {
    try {
      await this.eventos.registrar({ tipoEvento, perfilId, origen: 'dominio', propiedades });
    } catch (error) {
      this.logger.error(`No se pudo registrar el evento de analítica ${tipoEvento}: ${(error as Error).message}`);
    }
  }
}
