import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard, CurrentAccount, JwtPayload } from '@contexts/identidad-acceso/public-api';
import { GestionarPerfilUseCase } from '../application/gestionar-perfil.use-case';
import { PerfilSnapshot } from '../application/perfil-snapshot';

class FormacionAcademicaDto {
  @IsString() universidad!: string;
  @IsString() paisGraduacion!: string;
  @IsIn(['pregrado', 'especialidad', 'subespecialidad']) tipoTitulo!: 'pregrado' | 'especialidad' | 'subespecialidad';
  @IsOptional() @IsString() especialidad?: string;
}

class IdiomaDto {
  @IsString() idioma!: string;
  @IsString() nivel!: string;
}

class ObjetivosDto {
  @IsIn(['alta', 'media', 'baja']) urgencia!: 'alta' | 'media' | 'baja';
  @IsIn(['prefiere_rapido_competitivo', 'prefiere_lento_seguro']) toleranciaExamenCompetitivo!:
    | 'prefiere_rapido_competitivo'
    | 'prefiere_lento_seguro';
  @IsIn(['ingreso_largo_plazo', 'rapidez_de_practica']) prioridadIngresoVsRapidez!:
    | 'ingreso_largo_plazo'
    | 'rapidez_de_practica';
}

@Controller('perfil')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(private readonly gestionarPerfil: GestionarPerfilUseCase) {}

  @Get('me')
  async obtenerMiPerfil(@CurrentAccount() account: JwtPayload): Promise<PerfilSnapshot> {
    return this.gestionarPerfil.obtenerPorCuenta(account.sub);
  }

  @Post('me/formacion')
  async agregarFormacion(
    @CurrentAccount() account: JwtPayload,
    @Body() dto: FormacionAcademicaDto,
  ): Promise<PerfilSnapshot> {
    return this.gestionarPerfil.agregarFormacionAcademica(account.sub, dto);
  }

  @Post('me/idiomas')
  async agregarIdioma(@CurrentAccount() account: JwtPayload, @Body() dto: IdiomaDto): Promise<PerfilSnapshot> {
    return this.gestionarPerfil.agregarIdioma(account.sub, dto.idioma, dto.nivel);
  }

  @Put('me/objetivos')
  async actualizarObjetivos(
    @CurrentAccount() account: JwtPayload,
    @Body() dto: ObjetivosDto,
  ): Promise<PerfilSnapshot> {
    return this.gestionarPerfil.actualizarObjetivos(account.sub, dto);
  }
}
