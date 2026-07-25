import { BadRequestException, Body, Controller, Inject, NotFoundException, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsBoolean, IsEmail, IsISO8601, IsOptional } from 'class-validator';
import { writeFileSync } from 'node:fs';
import { AdminBasicAuthGuard } from '@infrastructure/admin/admin-basic-auth.guard';
import { BuscarCuentaIdPorEmailUseCase } from '@contexts/identidad-acceso/public-api';
import { RECURSOS_CURSO_REPORTE_CASO } from '../domain/acceso-curso';
import { CURSO_REPORTE_CASO_ID } from '../application/verificar-acceso.use-case';
import { ACCESO_CURSO_REPOSITORY, AccesoCursoRepositoryPort } from '../domain/academia-privada.repository.port';
import { AcademiaArchivosService } from './academia-archivos.service';

class OtorgarAccesoDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsBoolean()
  habilitado?: boolean;

  /** Fecha ISO 8601 (ej. "2026-09-01"). Si se omite, el acceso queda sin expiración. */
  @IsOptional()
  @IsISO8601()
  fechaExpiracion?: string;
}

/**
 * Único mecanismo de carga de archivos y de gestión de acceso del MVP: el
 * founder sube los 3 videos + el PDF, y concede/revoca acceso por email
 * (sin necesitar SQL directo ni conocer el `cuenta_id` de la estudiante),
 * todo protegido con las mismas credenciales del panel de "Comparte tu
 * historia" (ver AdminBasicAuthGuard). Evita depender de un proveedor de
 * almacenamiento externo — decisión explícita del founder para este MVP de
 * un solo estudiante.
 */
@Controller('academia/admin')
@UseGuards(AdminBasicAuthGuard)
export class AcademiaAdminController {
  constructor(
    private readonly archivos: AcademiaArchivosService,
    private readonly buscarCuentaIdPorEmail: BuscarCuentaIdPorEmailUseCase,
    @Inject(ACCESO_CURSO_REPOSITORY) private readonly repositorioAcceso: AccesoCursoRepositoryPort,
  ) {}

  @Post('archivos/:recurso')
  @UseInterceptors(FileInterceptor('archivo'))
  subirArchivo(@Param('recurso') recurso: string, @UploadedFile() archivo: Express.Multer.File): { ok: true; guardadoEn: string } {
    if (!RECURSOS_CURSO_REPORTE_CASO.includes(recurso as (typeof RECURSOS_CURSO_REPORTE_CASO)[number])) {
      throw new BadRequestException('Recurso no reconocido.');
    }
    if (!archivo) {
      throw new BadRequestException('Falta el archivo (campo "archivo").');
    }
    const ruta = this.archivos.rutaArchivo(recurso);
    if (!ruta) throw new BadRequestException('Recurso no reconocido.');
    writeFileSync(ruta, archivo.buffer);
    return { ok: true, guardadoEn: ruta };
  }

  /**
   * Concede o revoca el acceso al curso a partir del EMAIL con el que la
   * persona se registró en Medical Pathway — no requiere SQL ni conocer su
   * `cuenta_id`. Pensado para usarse desde el formulario móvil
   * `/academia/admin-acceso.html`, sin necesidad de una computadora.
   */
  @Post('acceso')
  async otorgarAcceso(@Body() dto: OtorgarAccesoDto): Promise<{ ok: true; email: string }> {
    const cuenta = await this.buscarCuentaIdPorEmail.ejecutar(dto.email);
    if (!cuenta) {
      throw new NotFoundException('No existe ninguna cuenta registrada con ese email en Medical Pathway.');
    }
    const habilitado = dto.habilitado ?? true;
    const fechaExpiracion = dto.fechaExpiracion ? new Date(dto.fechaExpiracion) : null;
    await this.repositorioAcceso.otorgarAcceso(cuenta.id, CURSO_REPORTE_CASO_ID, habilitado, fechaExpiracion);
    return { ok: true, email: dto.email };
  }
}
