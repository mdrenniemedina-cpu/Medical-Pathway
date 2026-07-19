import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  correlationId: string;
}

/**
 * AsyncLocalStorage evita tener que pasar el correlationId manualmente por
 * cada capa (controller → application → dominio → repositorio) — cualquier
 * log emitido durante el ciclo de vida de una petición puede recuperarlo
 * desde aquí, dando trazabilidad de errores extremo a extremo (punto 11 del
 * Sprint 0).
 */
export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function getCorrelationId(): string | undefined {
  return requestContextStorage.getStore()?.correlationId;
}
