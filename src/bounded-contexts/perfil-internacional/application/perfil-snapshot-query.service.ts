import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PERFIL_REPOSITORY, PerfilRepositoryPort } from '../domain/perfil.repository.port';
import { PerfilSnapshot, toPerfilSnapshot } from './perfil-snapshot';

/**
 * Único punto de lectura de Perfil Internacional expuesto a otros bounded
 * contexts (vía `public-api`). Deliberadamente de solo lectura: ningún otro
 * contexto puede escribir un perfil ajeno — solo el propio dueño, a través
 * del `PerfilController` de este contexto.
 */
@Injectable()
export class PerfilSnapshotQueryService {
  constructor(@Inject(PERFIL_REPOSITORY) private readonly perfiles: PerfilRepositoryPort) {}

  async porId(perfilId: string): Promise<PerfilSnapshot> {
    const perfil = await this.perfiles.buscarPorId(perfilId);
    if (!perfil) throw new NotFoundException('Perfil no encontrado.');
    return toPerfilSnapshot(perfil);
  }

  async porCuentaId(cuentaId: string): Promise<PerfilSnapshot> {
    const perfil = await this.perfiles.buscarPorCuentaId(cuentaId);
    if (!perfil) throw new NotFoundException('Perfil no encontrado para esta cuenta.');
    return toPerfilSnapshot(perfil);
  }
}
