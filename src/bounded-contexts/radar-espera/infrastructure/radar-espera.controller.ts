import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { JwtAuthGuard, CurrentAccount, JwtPayload } from '@contexts/identidad-acceso/public-api';
import { PerfilSnapshotQueryService } from '@contexts/perfil-internacional/public-api';
import { ReportarExpedienteUseCase } from '../application/reportar-expediente.use-case';
import { ActualizarResolucionUseCase } from '../application/actualizar-resolucion.use-case';
import { ConsultarMiCohorteUseCase } from '../application/consultar-mi-cohorte.use-case';

class ReportarExpedienteDto {
  @IsString() destinoId!: string;
  @IsString() rutaHomologacionId!: string;
  @IsOptional() @IsString() region?: string;
  @IsInt() anioEnvio!: number;
  @IsInt() @Min(1) @Max(4) trimestreEnvio!: number;
}

class ActualizarResolucionDto {
  @IsString() registroId!: string;
  @IsIn(['aprobado', 'subsanacion', 'rechazado']) estado!: 'aprobado' | 'subsanacion' | 'rechazado';
  fechaResolucion!: string;
  fechaEnvioReferencia!: string;
}

@Controller('radar-espera')
@UseGuards(JwtAuthGuard)
export class RadarEsperaController {
  constructor(
    private readonly reportar: ReportarExpedienteUseCase,
    private readonly actualizar: ActualizarResolucionUseCase,
    private readonly consultarCohorte: ConsultarMiCohorteUseCase,
    private readonly perfiles: PerfilSnapshotQueryService,
  ) {}

  @Post('registros')
  async reportarExpediente(@CurrentAccount() account: JwtPayload, @Body() dto: ReportarExpedienteDto) {
    const perfil = await this.perfiles.porCuentaId(account.sub);
    const registro = await this.reportar.ejecutar({ perfilId: perfil.perfilId, ...dto });
    return { registroId: registro.id, confirmado: registro.confirmadoPorUsuario };
  }

  @Patch('registros/resolucion')
  async actualizarResolucion(@Body() dto: ActualizarResolucionDto): Promise<{ ok: true }> {
    await this.actualizar.ejecutar({
      registroId: dto.registroId,
      estado: dto.estado,
      fechaResolucion: new Date(dto.fechaResolucion),
      fechaEnvioReferencia: new Date(dto.fechaEnvioReferencia),
    });
    return { ok: true };
  }

  @Get('mi-cohorte')
  async miCohorte(
    @CurrentAccount() account: JwtPayload,
    @Query('destinoId') destinoId: string,
    @Query('rutaHomologacionId') rutaHomologacionId: string,
  ) {
    const perfil = await this.perfiles.porCuentaId(account.sub);
    return this.consultarCohorte.ejecutar(perfil.perfilId, destinoId, rutaHomologacionId);
  }
}
