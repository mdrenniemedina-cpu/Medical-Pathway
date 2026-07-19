import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { EVENT_BUS, EventBusPort } from '@shared-kernel/application/event-bus.port';
import { EntroAEtapaDeEsperaEvent, EntroAEtapaDeEsperaPayload } from '@contexts/ruta-medico/public-api';
import {
  REGISTRO_EXPEDIENTE_REPOSITORY,
  RegistroExpedienteRepositoryPort,
} from '../domain/registro-expediente.repository.port';
import { RegistroExpediente } from '../domain/registro-expediente.aggregate';
import { TipoExpediente } from '../domain/value-objects/tipo-expediente.vo';
import { VentanaEnvio } from '../domain/value-objects/ventana-envio.vo';

function trimestreActual(): number {
  return Math.floor(new Date().getMonth() / 3) + 1;
}

/**
 * ANTI-CORRUPTION LAYER explícitamente identificado en `05-domain-model-ddd.md`
 * §3 y §8: Radar de Espera NO conoce la estructura de `RutaPersonalizada`
 * (etapas, documentos, notas) — solo consume el evento reducido y estable
 * `EntroAEtapaDeEspera` (destinoId, rutaHomologacionId, region) y lo traduce
 * a su propio modelo. Crea un BORRADOR (`confirmadoPorUsuario = false`) que
 * no cuenta para ningún agregado hasta que el propio usuario lo confirme
 * (reciprocidad de datos, ver `decisions/ADR-014`) — este ACL solo reduce
 * fricción pre-rellenando lo que ya se sabe, nunca reporta datos "en nombre"
 * del usuario sin su confirmación explícita.
 *
 * Es también el ejemplo concreto de por qué activar el Radar sobre la
 * espera de otro destino (Alemania, Canadá) en el futuro no requiere tocar
 * este archivo: el evento ya es genérico (ver `12-estrategia-escalamiento-multipais.md`).
 */
@Injectable()
export class RutaMedicoAcl implements OnModuleInit {
  private readonly logger = new Logger(RutaMedicoAcl.name);

  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
    @Inject(REGISTRO_EXPEDIENTE_REPOSITORY) private readonly registros: RegistroExpedienteRepositoryPort,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(EntroAEtapaDeEsperaEvent.EVENT_NAME, async (event: DomainEvent) => {
      const payload = event.payload as unknown as EntroAEtapaDeEsperaPayload;
      try {
        const existente = await this.registros.buscarPorPerfilDestinoRuta(
          payload.perfilId,
          payload.destinoId,
          payload.rutaHomologacionId,
        );
        if (existente) return; // ya hay un borrador o registro confirmado; no duplicar

        const ahora = new Date();
        const borrador = RegistroExpediente.crearBorrador(
          nanoid(),
          payload.perfilId,
          TipoExpediente.crear({
            destinoId: payload.destinoId,
            rutaHomologacionId: payload.rutaHomologacionId,
            region: payload.region,
          }),
          VentanaEnvio.crear(ahora.getFullYear(), trimestreActual()),
        );
        await this.registros.guardar(borrador);
      } catch (error) {
        this.logger.error(`No se pudo pre-rellenar el borrador de expediente: ${(error as Error).message}`);
      }
    });
  }
}
