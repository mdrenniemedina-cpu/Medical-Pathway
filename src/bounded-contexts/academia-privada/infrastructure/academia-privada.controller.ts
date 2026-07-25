import { Body, Controller, Get, Inject, Param, Post, Query, Req, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { IsIn } from 'class-validator';
import { Request, Response } from 'express';
import { createReadStream, statSync } from 'node:fs';
import { JwtAuthGuard, CurrentAccount, JwtPayload } from '@contexts/identidad-acceso/public-api';
import { VerificarAccesoUseCase, CURSO_REPORTE_CASO_ID } from '../application/verificar-acceso.use-case';
import { GenerarReproduccionUseCase } from '../application/generar-reproduccion.use-case';
import { RECURSOS_CURSO_REPORTE_CASO } from '../domain/acceso-curso';
import { ACCESO_CURSO_REPOSITORY, AccesoCursoRepositoryPort } from '../domain/academia-privada.repository.port';
import { TOKEN_REPRODUCCION_PORT, TokenReproduccionPort } from '../application/ports/token-reproduccion.port';
import { AcademiaArchivosService } from './academia-archivos.service';

class SolicitarReproduccionDto {
  @IsIn(RECURSOS_CURSO_REPORTE_CASO)
  recurso!: (typeof RECURSOS_CURSO_REPORTE_CASO)[number];
}

@Controller('academia')
export class AcademiaPrivadaController {
  constructor(
    private readonly verificarAcceso: VerificarAccesoUseCase,
    private readonly generarReproduccion: GenerarReproduccionUseCase,
    private readonly archivos: AcademiaArchivosService,
    @Inject(ACCESO_CURSO_REPOSITORY) private readonly repositorio: AccesoCursoRepositoryPort,
    @Inject(TOKEN_REPRODUCCION_PORT) private readonly tokens: TokenReproduccionPort,
  ) {}

  /** Requiere sesión de Medical Pathway (JWT) — devuelve si la cuenta tiene acceso vigente al curso. */
  @Get('mi-acceso')
  @UseGuards(JwtAuthGuard)
  async miAcceso(@CurrentAccount() account: JwtPayload): Promise<{ autorizado: boolean; fechaExpiracion: string | null }> {
    return this.verificarAcceso.ejecutar(account.sub);
  }

  /** Requiere sesión (JWT) + acceso vigente — devuelve una URL firmada de corta duración para UN recurso. */
  @Post('reproducir')
  @UseGuards(JwtAuthGuard)
  async solicitarReproduccion(
    @CurrentAccount() account: JwtPayload,
    @Body() dto: SolicitarReproduccionDto,
  ): Promise<{ url: string; expiraEnSegundos: number }> {
    return this.generarReproduccion.ejecutar(account.sub, dto.recurso);
  }

  /**
   * Endpoint PÚBLICO a propósito (sin JwtAuthGuard): un <video>/<a> del
   * navegador no puede enviar cabeceras Authorization personalizadas. Toda
   * la protección vive en `?token=` (HMAC + expiración, ver
   * AcademiaTokenService) — sin un token válido y vigente para ESTE
   * recurso, no hay forma de reproducir ni descargar nada.
   */
  @Get('reproducir/:recurso')
  async reproducir(@Param('recurso') recurso: string, @Query('token') token: string, @Req() req: Request, @Res() res: Response): Promise<void> {
    const verificado = token ? this.tokens.verificar(token) : null;
    if (!verificado || verificado.recurso !== recurso) {
      throw new NotFoundException();
    }

    const ruta = this.archivos.rutaArchivo(recurso);
    if (!ruta) throw new NotFoundException();

    let tamano: number;
    try {
      tamano = statSync(ruta).size;
    } catch {
      throw new NotFoundException('Archivo no disponible todavía.');
    }

    // Registro de auditoría básico — no bloquea la reproducción si falla.
    this.repositorio.registrarVisualizacion(verificado.cuentaId, CURSO_REPORTE_CASO_ID, recurso).catch(() => {});

    const tipoMime = this.archivos.tipoMime(recurso);
    const rango = req.headers.range;

    if (!rango) {
      res.writeHead(200, { 'Content-Type': tipoMime, 'Content-Length': tamano, 'Accept-Ranges': 'bytes' });
      createReadStream(ruta).pipe(res);
      return;
    }

    const coincidencia = /bytes=(\d*)-(\d*)/.exec(rango);
    const inicio = coincidencia?.[1] ? parseInt(coincidencia[1], 10) : 0;
    const fin = coincidencia?.[2] ? parseInt(coincidencia[2], 10) : tamano - 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${inicio}-${fin}/${tamano}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': fin - inicio + 1,
      'Content-Type': tipoMime,
    });
    createReadStream(ruta, { start: inicio, end: fin }).pipe(res);
  }
}
