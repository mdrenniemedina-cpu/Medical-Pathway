export { DescubrimientoModule } from '../infrastructure/descubrimiento.module';
export type { ResultadoDescubrimientoView, PuntuacionDestinoView, RazonView } from '../application/resultado-view';
export {
  DescubrimientoCompletadoEvent,
  DestinoSeleccionadoEvent,
} from '../domain/events/descubrimiento-eventos';
export type {
  DescubrimientoCompletadoPayload,
  DestinoSeleccionadoPayload,
} from '../domain/events/descubrimiento-eventos';
