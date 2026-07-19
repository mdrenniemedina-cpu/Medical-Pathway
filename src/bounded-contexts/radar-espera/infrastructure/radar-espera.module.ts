import { Module } from '@nestjs/common';
import { IdentidadAccesoModule } from '@contexts/identidad-acceso/public-api';
import { PerfilInternacionalModule } from '@contexts/perfil-internacional/public-api';
import { RutaMedicoModule } from '@contexts/ruta-medico/public-api';
import { REGISTRO_EXPEDIENTE_REPOSITORY } from '../domain/registro-expediente.repository.port';
import { RegistroExpedienteRepositoryPg } from './registro-expediente.repository.pg';
import { COHORTE_REPOSITORY } from '../domain/cohorte.repository.port';
import { CohorteRepositoryPg } from './cohorte.repository.pg';
import { PERFIL_VERIFICACION } from '../application/ports/perfil-verificacion.port';
import { PerfilAcl } from './perfil.acl';
import { RutaMedicoAcl } from './ruta-medico.acl';
import { CohorteRefreshService } from './cohorte-refresh.service';
import { ReportarExpedienteUseCase } from '../application/reportar-expediente.use-case';
import { ActualizarResolucionUseCase } from '../application/actualizar-resolucion.use-case';
import { ConsultarMiCohorteUseCase } from '../application/consultar-mi-cohorte.use-case';
import { RadarEsperaController } from './radar-espera.controller';

@Module({
  imports: [IdentidadAccesoModule, PerfilInternacionalModule, RutaMedicoModule],
  controllers: [RadarEsperaController],
  providers: [
    { provide: REGISTRO_EXPEDIENTE_REPOSITORY, useClass: RegistroExpedienteRepositoryPg },
    { provide: COHORTE_REPOSITORY, useClass: CohorteRepositoryPg },
    { provide: PERFIL_VERIFICACION, useClass: PerfilAcl },
    RutaMedicoAcl,
    CohorteRefreshService,
    ReportarExpedienteUseCase,
    ActualizarResolucionUseCase,
    ConsultarMiCohorteUseCase,
  ],
})
export class RadarEsperaModule {}
