import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { JwtAuthGuard, CurrentAccount, JwtPayload } from '@contexts/identidad-acceso/public-api';
import { PerfilSnapshotQueryService } from '@contexts/perfil-internacional/public-api';
import { CalcularDescubrimientoUseCase } from '../application/calcular-descubrimiento.use-case';
import { SeleccionarDestinoUseCase } from '../application/seleccionar-destino.use-case';
import { ResultadoDescubrimientoView } from '../application/resultado-view';

class SeleccionarDestinoDto {
  @IsString()
  resultadoId!: string;

  @IsString()
  destinoId!: string;
}

@Controller('descubrimiento')
@UseGuards(JwtAuthGuard)
export class DescubrimientoController {
  constructor(
    private readonly calcular: CalcularDescubrimientoUseCase,
    private readonly seleccionar: SeleccionarDestinoUseCase,
    private readonly perfiles: PerfilSnapshotQueryService,
  ) {}

  @Post('calcular')
  async calcularParaMiPerfil(@CurrentAccount() account: JwtPayload): Promise<ResultadoDescubrimientoView> {
    const perfil = await this.perfiles.porCuentaId(account.sub);
    return this.calcular.ejecutar(perfil.perfilId);
  }

  @Post('seleccionar-destino')
  async seleccionarDestino(@Body() dto: SeleccionarDestinoDto): Promise<{ ok: true }> {
    await this.seleccionar.ejecutar(dto.resultadoId, dto.destinoId);
    return { ok: true };
  }
}
