import { Injectable } from '@nestjs/common';
import { PerfilSnapshotQueryService } from '@contexts/perfil-internacional/public-api';
import { PerfilParaCompararPort } from '../application/ports/perfil-para-comparar.port';
import { PerfilParaComparar } from '../domain/servicios/motor-compatibilidad.service';

/** Anti-Corruption Layer hacia Perfil Internacional. */
@Injectable()
export class PerfilAcl implements PerfilParaCompararPort {
  constructor(private readonly perfiles: PerfilSnapshotQueryService) {}

  async obtener(perfilId: string): Promise<PerfilParaComparar> {
    const snapshot = await this.perfiles.porId(perfilId);
    return {
      idiomasDominados: snapshot.idiomas.map((i) => ({ idioma: i.idioma, nivel: i.nivel })),
    };
  }
}
