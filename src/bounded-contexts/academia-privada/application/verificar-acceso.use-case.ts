import { Inject, Injectable } from '@nestjs/common';
import { accesoVigente } from '../domain/acceso-curso';
import { ACCESO_CURSO_REPOSITORY, AccesoCursoRepositoryPort } from '../domain/academia-privada.repository.port';

export const CURSO_REPORTE_CASO_ID = 'reporte-caso';

@Injectable()
export class VerificarAccesoUseCase {
  constructor(@Inject(ACCESO_CURSO_REPOSITORY) private readonly accesos: AccesoCursoRepositoryPort) {}

  async ejecutar(cuentaId: string): Promise<{ autorizado: boolean; fechaExpiracion: string | null }> {
    const acceso = await this.accesos.buscar(cuentaId, CURSO_REPORTE_CASO_ID);
    return {
      autorizado: accesoVigente(acceso),
      fechaExpiracion: acceso?.fechaExpiracion ? acceso.fechaExpiracion.toISOString() : null,
    };
  }
}
