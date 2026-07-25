import { Module } from '@nestjs/common';
import { IdentidadAccesoModule } from '@contexts/identidad-acceso/public-api';
import { AcademiaPrivadaController } from './academia-privada.controller';
import { AcademiaAdminController } from './academia-admin.controller';
import { AcademiaPrivadaRepository } from './academia-privada.repository';
import { AcademiaTokenService } from './academia-token.service';
import { AcademiaArchivosService } from './academia-archivos.service';
import { AdminBasicAuthGuard } from '@infrastructure/admin/admin-basic-auth.guard';
import { ACCESO_CURSO_REPOSITORY } from '../domain/academia-privada.repository.port';
import { TOKEN_REPRODUCCION_PORT } from '../application/ports/token-reproduccion.port';
import { VerificarAccesoUseCase } from '../application/verificar-acceso.use-case';
import { GenerarReproduccionUseCase } from '../application/generar-reproduccion.use-case';

@Module({
  imports: [IdentidadAccesoModule],
  controllers: [AcademiaPrivadaController, AcademiaAdminController],
  providers: [
    VerificarAccesoUseCase,
    GenerarReproduccionUseCase,
    AcademiaArchivosService,
    AdminBasicAuthGuard,
    { provide: ACCESO_CURSO_REPOSITORY, useClass: AcademiaPrivadaRepository },
    { provide: TOKEN_REPRODUCCION_PORT, useClass: AcademiaTokenService },
  ],
})
export class AcademiaPrivadaModule {}
