import { Injectable } from '@nestjs/common';
import { PerfilSnapshotQueryService } from '@contexts/perfil-internacional/public-api';
import { PerfilVerificacionPort } from '../application/ports/perfil-verificacion.port';
import { NivelVerificacionPerfil } from '../domain/servicios/calculador-confianza.service';

@Injectable()
export class PerfilAcl implements PerfilVerificacionPort {
  constructor(private readonly perfiles: PerfilSnapshotQueryService) {}

  async obtenerNivelVerificacion(perfilId: string): Promise<NivelVerificacionPerfil> {
    const snapshot = await this.perfiles.porId(perfilId);
    return snapshot.nivelVerificacion as NivelVerificacionPerfil;
  }
}
