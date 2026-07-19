import { Module } from '@nestjs/common';
import { IdentidadAccesoModule } from '@contexts/identidad-acceso/public-api';
import { PerfilInternacionalModule } from '@contexts/perfil-internacional/public-api';
import { CatalogoModule } from '@contexts/catalogo/public-api';
import {
  RESULTADO_REPOSITORY,
  REGLA_COMPATIBILIDAD_REPOSITORY,
} from '../domain/descubrimiento.repository.port';
import { ResultadoRepositoryPg } from './resultado.repository.pg';
import { ReglaCompatibilidadRepositoryPg } from './regla-compatibilidad.repository.pg';
import { PERFIL_PARA_COMPARAR } from '../application/ports/perfil-para-comparar.port';
import { PerfilAcl } from './perfil.acl';
import { DESTINOS_PARA_COMPARAR } from '../application/ports/destinos-para-comparar.port';
import { CatalogoAcl } from './catalogo.acl';
import { CalcularDescubrimientoUseCase } from '../application/calcular-descubrimiento.use-case';
import { SeleccionarDestinoUseCase } from '../application/seleccionar-destino.use-case';
import { DescubrimientoController } from './descubrimiento.controller';

@Module({
  imports: [IdentidadAccesoModule, PerfilInternacionalModule, CatalogoModule],
  controllers: [DescubrimientoController],
  providers: [
    { provide: RESULTADO_REPOSITORY, useClass: ResultadoRepositoryPg },
    { provide: REGLA_COMPATIBILIDAD_REPOSITORY, useClass: ReglaCompatibilidadRepositoryPg },
    { provide: PERFIL_PARA_COMPARAR, useClass: PerfilAcl },
    { provide: DESTINOS_PARA_COMPARAR, useClass: CatalogoAcl },
    CalcularDescubrimientoUseCase,
    SeleccionarDestinoUseCase,
  ],
  exports: [CalcularDescubrimientoUseCase, SeleccionarDestinoUseCase],
})
export class DescubrimientoModule {}
