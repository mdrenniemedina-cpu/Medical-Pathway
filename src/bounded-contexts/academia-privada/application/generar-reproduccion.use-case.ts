import { Inject, Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { accesoVigente, RECURSOS_CURSO_REPORTE_CASO } from '../domain/acceso-curso';
import { ACCESO_CURSO_REPOSITORY, AccesoCursoRepositoryPort } from '../domain/academia-privada.repository.port';
import { TOKEN_REPRODUCCION_PORT, TokenReproduccionPort } from './ports/token-reproduccion.port';
import { CURSO_REPORTE_CASO_ID } from './verificar-acceso.use-case';

/**
 * 3 horas — suficiente para ver un video de principio a fin, pausar,
 * retroceder y re-ver una parte sin que expire a mitad de la reproducción
 * (el navegador vuelve a pedir bytes con Range en cada seek, reutilizando
 * la misma URL firmada durante toda la sesión de reproducción). Pasado ese
 * tiempo, la URL deja de servir — hay que pedir una nueva desde la app.
 */
const TTL_TOKEN_SEGUNDOS = 3 * 60 * 60;

@Injectable()
export class GenerarReproduccionUseCase {
  constructor(
    @Inject(ACCESO_CURSO_REPOSITORY) private readonly accesos: AccesoCursoRepositoryPort,
    @Inject(TOKEN_REPRODUCCION_PORT) private readonly tokens: TokenReproduccionPort,
  ) {}

  async ejecutar(cuentaId: string, recurso: string): Promise<{ url: string; expiraEnSegundos: number }> {
    if (!RECURSOS_CURSO_REPORTE_CASO.includes(recurso as (typeof RECURSOS_CURSO_REPORTE_CASO)[number])) {
      throw new BadRequestException('Recurso no reconocido.');
    }
    const acceso = await this.accesos.buscar(cuentaId, CURSO_REPORTE_CASO_ID);
    if (!accesoVigente(acceso)) {
      throw new ForbiddenException('No tienes acceso a este curso.');
    }
    const token = this.tokens.firmar({ cuentaId, recurso, ttlSegundos: TTL_TOKEN_SEGUNDOS });
    return { url: `/api/v1/academia/reproducir/${recurso}?token=${token}`, expiraEnSegundos: TTL_TOKEN_SEGUNDOS };
  }
}
