import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DomainEvent } from '@shared-kernel/domain/domain-event.base';
import { EVENT_BUS, EventBusPort } from '@shared-kernel/application/event-bus.port';
import { CuentaRegistradaEvent } from '@contexts/identidad-acceso/public-api';
import { GestionarPerfilUseCase } from '../application/gestionar-perfil.use-case';

/**
 * Reacciona al evento de integración publicado por Identidad y Acceso
 * (Customer-Supplier, ver `05-domain-model-ddd.md` §3) creando un Perfil
 * Internacional vacío apenas se registra una cuenta — el usuario lo completa
 * después vía onboarding. Nótese que este suscriptor importa el evento
 * SOLO desde `@contexts/identidad-acceso/public-api`, nunca desde su
 * `domain/` interno — así lo verifica `test/architecture/boundaries.spec.ts`.
 */
@Injectable()
export class CrearPerfilAlRegistrarCuentaSubscriber implements OnModuleInit {
  private readonly logger = new Logger(CrearPerfilAlRegistrarCuentaSubscriber.name);

  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
    private readonly gestionarPerfil: GestionarPerfilUseCase,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe(CuentaRegistradaEvent.EVENT_NAME, async (event: DomainEvent) => {
      const cuentaId = event.aggregateId;
      try {
        await this.gestionarPerfil.crearParaCuenta(cuentaId);
      } catch (error) {
        this.logger.error(`No se pudo crear el perfil para la cuenta ${cuentaId}: ${(error as Error).message}`);
      }
    });
  }
}
