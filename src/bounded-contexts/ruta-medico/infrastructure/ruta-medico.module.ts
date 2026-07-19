import { Module } from '@nestjs/common';
import { IdentidadAccesoModule } from '@contexts/identidad-acceso/public-api';
import { PerfilInternacionalModule } from '@contexts/perfil-internacional/public-api';
import { CatalogoModule } from '@contexts/catalogo/public-api';
import { DescubrimientoModule } from '@contexts/descubrimiento/public-api';
import { RUTA_PERSONALIZADA_REPOSITORY } from '../domain/ruta-personalizada.repository.port';
import { RutaPersonalizadaRepositoryPg } from './ruta-personalizada.repository.pg';
import { PLANTILLA_RUTA } from '../application/ports/plantilla-ruta.port';
import { CatalogoAcl } from './catalogo.acl';
import { CrearRutaPersonalizadaUseCase } from '../application/crear-ruta-personalizada.use-case';
import { GestionarEtapasUseCase } from '../application/gestionar-etapas.use-case';
import { RutaMedicoController } from './ruta-medico.controller';
import { CrearRutaAlSeleccionarDestinoSubscriber } from './crear-ruta-al-seleccionar-destino.subscriber';

@Module({
  imports: [IdentidadAccesoModule, PerfilInternacionalModule, CatalogoModule, DescubrimientoModule],
  controllers: [RutaMedicoController],
  providers: [
    { provide: RUTA_PERSONALIZADA_REPOSITORY, useClass: RutaPersonalizadaRepositoryPg },
    { provide: PLANTILLA_RUTA, useClass: CatalogoAcl },
    CrearRutaPersonalizadaUseCase,
    GestionarEtapasUseCase,
    CrearRutaAlSeleccionarDestinoSubscriber,
  ],
  exports: [GestionarEtapasUseCase],
})
export class RutaMedicoModule {}
