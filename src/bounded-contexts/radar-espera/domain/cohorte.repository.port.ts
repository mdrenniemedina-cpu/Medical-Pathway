export interface DistribucionTiempos {
  p25Dias: number;
  p50Dias: number;
  p75Dias: number;
  p90Dias: number;
}

export interface CohorteDisponible {
  disponible: true;
  nRegistros: number;
  distribucion: DistribucionTiempos;
  proporcionResuelta: number;
  nivelConfianzaEstimacion: 'alta' | 'media' | 'preliminar';
}

export interface CohorteNoDisponible {
  disponible: false;
  nRegistros: number;
  mensaje: string;
}

export type ConsultaCohorte = CohorteDisponible | CohorteNoDisponible;

/**
 * INVARIANTE CENTRAL DEL RADAR DE ESPERA (ver `05-domain-model-ddd.md` §8 y
 * `decisions/ADR-008`): la implementación de este puerto DEBE devolver
 * `{ disponible: false }` (sin distribución, sin proporción, sin ningún
 * número derivado) si `nRegistros` está por debajo del umbral de
 * k-anonimato — sin excepciones, sin importar quién consulte. Ver
 * `test/architecture/invariantes.radar-k-anonimato.spec.ts`.
 */
export interface CohorteRepositoryPort {
  consultar(destinoId: string, rutaHomologacionId: string, anio: number, trimestre: number, region?: string): Promise<ConsultaCohorte>;
}
export const COHORTE_REPOSITORY = Symbol('COHORTE_REPOSITORY');
