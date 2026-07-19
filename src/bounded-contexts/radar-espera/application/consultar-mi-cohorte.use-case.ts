import { Inject, Injectable } from '@nestjs/common';
import {
  REGISTRO_EXPEDIENTE_REPOSITORY,
  RegistroExpedienteRepositoryPort,
} from '../domain/registro-expediente.repository.port';
import { COHORTE_REPOSITORY, CohorteRepositoryPort, ConsultaCohorte } from '../domain/cohorte.repository.port';

/**
 * Mecanismo de reciprocidad de datos (ver `decisions/ADR-014` y
 * `14-estrategia-retencion-engagement.md` §1): el detalle completo de la
 * cohorte SOLO se devuelve si el propio perfil ya confirmó su registro para
 * el mismo destino+ruta. No es un muro de pago monetario — es un muro de
 * pago de datos, que además mejora la calidad del propio activo.
 */
@Injectable()
export class ConsultarMiCohorteUseCase {
  constructor(
    @Inject(REGISTRO_EXPEDIENTE_REPOSITORY) private readonly registros: RegistroExpedienteRepositoryPort,
    @Inject(COHORTE_REPOSITORY) private readonly cohortes: CohorteRepositoryPort,
  ) {}

  async ejecutar(
    perfilId: string,
    destinoId: string,
    rutaHomologacionId: string,
  ): Promise<ConsultaCohorte | { disponible: false; nRegistros: 0; mensaje: string; requiereReciprocidad: true }> {
    const miRegistro = await this.registros.buscarPorPerfilDestinoRuta(perfilId, destinoId, rutaHomologacionId);
    if (!miRegistro?.confirmadoPorUsuario) {
      return {
        disponible: false,
        nRegistros: 0,
        mensaje: 'Reporta tu propio expediente para desbloquear la comparación con tu cohorte.',
        requiereReciprocidad: true,
      };
    }
    return this.cohortes.consultar(
      destinoId,
      rutaHomologacionId,
      miRegistro.ventanaEnvio.anio,
      miRegistro.ventanaEnvio.trimestre,
      miRegistro.tipoExpediente.region,
    );
  }
}
