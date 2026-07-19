import { Injectable } from '@nestjs/common';
import { CatalogoQueryService } from '@contexts/catalogo/public-api';
import { EtapaPlantilla, PlantillaRutaPort } from '../application/ports/plantilla-ruta.port';

/** Anti-Corruption Layer hacia el Catálogo (traduce `RutaHomologacionView` a `EtapaPlantilla[]`). */
@Injectable()
export class CatalogoAcl implements PlantillaRutaPort {
  constructor(private readonly catalogo: CatalogoQueryService) {}

  async obtenerEtapasPublicadas(destinoId: string): Promise<{ rutaHomologacionId: string; etapas: EtapaPlantilla[] }> {
    const ruta = await this.catalogo.obtenerRutaPublicadaDeDestino(destinoId);
    return {
      rutaHomologacionId: ruta.id,
      etapas: ruta.etapas.map((e) => ({
        etapaRutaId: e.id,
        orden: e.orden,
        nombre: e.nombre,
        tipo: e.tipo as EtapaPlantilla['tipo'],
        esConfigurablePorPerfil: e.esConfigurablePorPerfil,
        prerequisitoEtapaId: e.prerequisitoEtapaId,
      })),
    };
  }
}
