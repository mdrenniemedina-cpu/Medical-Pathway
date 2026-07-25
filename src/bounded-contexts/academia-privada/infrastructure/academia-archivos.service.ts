import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const NOMBRE_ARCHIVO: Record<string, string> = {
  'video-1': 'video-1.mp4',
  'video-2': 'video-2.mp4',
  'video-3': 'video-3.mp4',
  'guia-care': 'guia-care.pdf',
};

const TIPO_MIME: Record<string, string> = {
  'video-1': 'video/mp4',
  'video-2': 'video/mp4',
  'video-3': 'video/mp4',
  'guia-care': 'application/pdf',
};

/**
 * Los archivos (3 videos + 1 PDF) viven en un directorio del propio
 * servidor, fuera de `public/` (nunca servidos por ServeStaticModule, por
 * eso nunca son públicamente enlazables) — decisión explícita del founder
 * de evitar Supabase u otro proveedor externo para este MVP de un solo
 * estudiante. En Render, este directorio debe vivir sobre un disco
 * persistente para sobrevivir a los redeploys (ver docs/29-runbook).
 */
@Injectable()
export class AcademiaArchivosService {
  constructor(private readonly config: ConfigService) {}

  private directorio(): string {
    const dir = resolve(this.config.get<string>('ACADEMIA_ARCHIVOS_DIR') ?? './academia-privada-archivos');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return dir;
  }

  rutaArchivo(recurso: string): string | null {
    const nombre = NOMBRE_ARCHIVO[recurso];
    if (!nombre) return null;
    return join(this.directorio(), nombre);
  }

  tipoMime(recurso: string): string {
    return TIPO_MIME[recurso] ?? 'application/octet-stream';
  }

  nombreArchivoParaGuardar(recurso: string): string | null {
    return NOMBRE_ARCHIVO[recurso] ?? null;
  }
}
