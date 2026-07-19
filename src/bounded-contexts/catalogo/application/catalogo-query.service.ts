import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DESTINO_REPOSITORY,
  DestinoRepositoryPort,
  RUTA_HOMOLOGACION_REPOSITORY,
  RutaHomologacionRepositoryPort,
} from '../domain/catalogo.repository.port';
import { DestinoView, toDestinoView } from './destino-view';
import { EtapaRutaView, RutaHomologacionView, toRutaHomologacionView } from './ruta-homologacion-view';
import { ProyeccionRutaView, toProyeccionView } from './proyeccion-view';

/**
 * Servicio de lectura del Catálogo — es lo único que otros contextos
 * (Descubrimiento, Ruta del Médico) consumen vía `public-api`. Nunca
 * escriben aquí: la escritura del catálogo es exclusiva del rol
 * `editor_contenido` a través de los use-cases internos de este contexto.
 */
@Injectable()
export class CatalogoQueryService {
  constructor(
    @Inject(DESTINO_REPOSITORY) private readonly destinos: DestinoRepositoryPort,
    @Inject(RUTA_HOMOLOGACION_REPOSITORY) private readonly rutas: RutaHomologacionRepositoryPort,
  ) {}

  async listarDestinos(): Promise<DestinoView[]> {
    const destinos = await this.destinos.listar();
    return destinos.map(toDestinoView);
  }

  async obtenerDestino(id: string): Promise<DestinoView> {
    const destino = await this.destinos.buscarPorId(id);
    if (!destino) throw new NotFoundException('Destino no encontrado.');
    return toDestinoView(destino);
  }

  async obtenerRutaPublicadaDeDestino(destinoId: string): Promise<RutaHomologacionView> {
    const ruta = await this.rutas.buscarPublicadaPorDestino(destinoId);
    if (!ruta) throw new NotFoundException('No hay una ruta de homologación publicada para este destino.');
    return toRutaHomologacionView(ruta);
  }

  async obtenerProyeccionDeDestino(destinoId: string): Promise<ProyeccionRutaView> {
    const ruta = await this.obtenerRutaPublicadaDeDestino(destinoId);
    return toProyeccionView(ruta);
  }
}

export type { EtapaRutaView, RutaHomologacionView, ProyeccionRutaView };
