import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentAccount, JwtPayload } from '@contexts/identidad-acceso/public-api';
import { PerfilSnapshotQueryService } from '@contexts/perfil-internacional/public-api';
import { GestionarEtapasUseCase } from '../application/gestionar-etapas.use-case';
import { RutaPersonalizadaView } from '../application/ruta-personalizada-view';

@Controller('ruta-medico')
@UseGuards(JwtAuthGuard)
export class RutaMedicoController {
  constructor(
    private readonly gestionarEtapas: GestionarEtapasUseCase,
    private readonly perfiles: PerfilSnapshotQueryService,
  ) {}

  @Get('mi-ruta')
  async miRuta(
    @CurrentAccount() account: JwtPayload,
    @Query('destinoId') destinoId: string,
  ): Promise<RutaPersonalizadaView> {
    const perfil = await this.perfiles.porCuentaId(account.sub);
    return this.gestionarEtapas.obtenerMiRuta(perfil.perfilId, destinoId);
  }

  @Patch(':rutaId/etapas/:etapaId/iniciar')
  async iniciarEtapa(@Param('rutaId') rutaId: string, @Param('etapaId') etapaId: string): Promise<RutaPersonalizadaView> {
    return this.gestionarEtapas.iniciarEtapa(rutaId, etapaId);
  }

  @Patch(':rutaId/etapas/:etapaId/completar')
  async completarEtapa(@Param('rutaId') rutaId: string, @Param('etapaId') etapaId: string): Promise<RutaPersonalizadaView> {
    return this.gestionarEtapas.completarEtapa(rutaId, etapaId);
  }
}
