import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'node:fs';
import { AdminBasicAuthGuard } from '@infrastructure/admin/admin-basic-auth.guard';
import { RECURSOS_CURSO_REPORTE_CASO } from '../domain/acceso-curso';
import { AcademiaArchivosService } from './academia-archivos.service';

/**
 * Único mecanismo de carga de archivos del MVP: el founder sube los 3
 * videos + el PDF una vez, protegido con las mismas credenciales del panel
 * de "Comparte tu historia" (ver AdminBasicAuthGuard). Evita depender de un
 * proveedor de almacenamiento externo — decisión explícita del founder
 * para este MVP de un solo estudiante.
 */
@Controller('academia/admin')
@UseGuards(AdminBasicAuthGuard)
export class AcademiaAdminController {
  constructor(private readonly archivos: AcademiaArchivosService) {}

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
}
