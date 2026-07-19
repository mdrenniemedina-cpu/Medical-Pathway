import { IntegrationEvent } from '@shared-kernel/domain/domain-event.base';

export interface DescubrimientoCompletadoPayload extends Record<string, unknown> {
  perfilId: string;
  reglasVersion: number;
  destinoTopId: string;
  destinoTopPorcentaje: number;
}
export class DescubrimientoCompletadoEvent extends IntegrationEvent<DescubrimientoCompletadoPayload> {
  static readonly EVENT_NAME = 'descubrimiento.DescubrimientoCompletado';
  constructor(resultadoId: string, payload: DescubrimientoCompletadoPayload) {
    super(DescubrimientoCompletadoEvent.EVENT_NAME, resultadoId, payload);
  }
}

export interface DestinoSeleccionadoPayload extends Record<string, unknown> {
  perfilId: string;
  destinoId: string;
  resultadoId: string;
}
/**
 * El evento más importante de este contexto hacia el resto del sistema:
 * dispara en Ruta del Médico la instanciación de la RutaPersonalizada
 * (Customer-Supplier, ver `05-domain-model-ddd.md` §3).
 */
export class DestinoSeleccionadoEvent extends IntegrationEvent<DestinoSeleccionadoPayload> {
  static readonly EVENT_NAME = 'descubrimiento.DestinoSeleccionado';
  constructor(perfilId: string, payload: DestinoSeleccionadoPayload) {
    super(DestinoSeleccionadoEvent.EVENT_NAME, perfilId, payload);
  }
}
