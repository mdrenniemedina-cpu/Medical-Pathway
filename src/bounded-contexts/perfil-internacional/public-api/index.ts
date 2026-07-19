/**
 * Public API del contexto Perfil Internacional. Expone únicamente un
 * servicio de lectura (`PerfilSnapshotQueryService`) y los eventos de
 * integración — nunca el agregado ni el repositorio de escritura. Ver
 * `05-domain-model-ddd.md` §4 y ADR-010.
 */
export { PerfilInternacionalModule } from '../infrastructure/perfil-internacional.module';
export { PerfilSnapshotQueryService } from '../application/perfil-snapshot-query.service';
export type { PerfilSnapshot } from '../application/perfil-snapshot';
export {
  PerfilCreadoEvent,
  PerfilActualizadoEvent,
  NivelDeVerificacionElevadoEvent,
} from '../domain/events/perfil-eventos';
