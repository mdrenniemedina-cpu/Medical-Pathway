import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RUTA_PERSONALIZADA_REPOSITORY, RutaPersonalizadaRepositoryPort } from '../domain/ruta-personalizada.repository.port';
import { RutaPersonalizada } from '../domain/ruta-personalizada.aggregate';
import { EtapaPersonalizada } from '../domain/etapa-personalizada.entity';
import { PLANTILLA_RUTA, PlantillaRutaPort } from './ports/plantilla-ruta.port';

/**
 * Reacciona (vía suscriptor de infraestructura) al evento `DestinoSeleccionado`
 * de Descubrimiento. La "personalización real" (instrucción del founder: "no
 * quiero checklists genéricos") ocurre aquí: por ahora se instancian todas
 * las etapas de la plantilla como obligatorias; el punto de extensión para
 * adaptar/omitir etapas según el perfil (p.ej. MIR opcional) es
 * `etapa.esConfigurablePorPerfil`, que ya viaja en la plantilla — la lógica
 * de decisión fina se implementará en Sprint 1+ cuando el perfil aporte
 * suficientes señales (ver `docs/03-mvp-definition.md`).
 */
@Injectable()
export class CrearRutaPersonalizadaUseCase {
  constructor(
    @Inject(RUTA_PERSONALIZADA_REPOSITORY) private readonly rutas: RutaPersonalizadaRepositoryPort,
    @Inject(PLANTILLA_RUTA) private readonly plantillas: PlantillaRutaPort,
  ) {}

  async ejecutar(perfilId: string, destinoId: string): Promise<RutaPersonalizada> {
    const existente = await this.rutas.buscarActivaPorPerfilYDestino(perfilId, destinoId);
    if (existente) return existente; // invariante: una ruta activa por perfil+destino

    const { rutaHomologacionId, etapas } = await this.plantillas.obtenerEtapasPublicadas(destinoId);
    const etapasPersonalizadas = etapas.map((e) =>
      EtapaPersonalizada.crear({
        id: nanoid(),
        etapaRutaId: e.etapaRutaId,
        orden: e.orden,
        nombre: e.nombre,
        tipo: e.tipo,
        estado: 'pendiente',
        obligatoria: true,
        prerequisitoEtapaPersonalizadaId: undefined, // se resuelve por `orden` en Sprint 1; ver nota en docstring
        documentos: [],
      }),
    );

    const ruta = RutaPersonalizada.crear(nanoid(), perfilId, destinoId, rutaHomologacionId, etapasPersonalizadas);
    await this.rutas.guardar(ruta);
    return ruta;
  }
}
