import { Module } from '@nestjs/common';
import { IdentidadAccesoModule } from '@contexts/identidad-acceso/public-api';
import { PERFIL_REPOSITORY } from '../domain/perfil.repository.port';
import { PerfilRepositoryPg } from './perfil.repository.pg';
import { GestionarPerfilUseCase } from '../application/gestionar-perfil.use-case';
import { PerfilSnapshotQueryService } from '../application/perfil-snapshot-query.service';
import { PerfilController } from './perfil.controller';
import { CrearPerfilAlRegistrarCuentaSubscriber } from './crear-perfil-al-registrar-cuenta.subscriber';

@Module({
  imports: [IdentidadAccesoModule],
  controllers: [PerfilController],
  providers: [
    { provide: PERFIL_REPOSITORY, useClass: PerfilRepositoryPg },
    GestionarPerfilUseCase,
    PerfilSnapshotQueryService,
    CrearPerfilAlRegistrarCuentaSubscriber,
  ],
  exports: [PerfilSnapshotQueryService],
})
export class PerfilInternacionalModule {}
