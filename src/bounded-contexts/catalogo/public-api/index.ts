/**
 * Public API del Catálogo (Open Host Service). Descubrimiento y Ruta del
 * Médico consumen exclusivamente `CatalogoQueryService` (solo lectura) y los
 * tipos de vista — nunca los agregados `Destino`/`RutaHomologacion` ni sus
 * repositorios de escritura.
 */
export { CatalogoModule } from '../infrastructure/catalogo.module';
export { CatalogoQueryService } from '../application/catalogo-query.service';
export type { DestinoView, AtributoConFuenteView } from '../application/destino-view';
export type { RutaHomologacionView, EtapaRutaView } from '../application/ruta-homologacion-view';
export {
  RutaHomologacionPublicadaEvent,
  RutaHomologacionActualizadaEvent,
} from '../domain/events/ruta-homologacion-eventos';
