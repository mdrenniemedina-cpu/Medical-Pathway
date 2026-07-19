export interface EtapaPlantilla {
  etapaRutaId: string;
  orden: number;
  nombre: string;
  tipo: 'documental' | 'examen' | 'espera' | 'registro';
  esConfigurablePorPerfil: boolean;
  prerequisitoEtapaId?: string;
}

/** ACL hacia el Catálogo — ver `infrastructure/catalogo.acl.ts` de este contexto. */
export interface PlantillaRutaPort {
  obtenerEtapasPublicadas(destinoId: string): Promise<{ rutaHomologacionId: string; etapas: EtapaPlantilla[] }>;
}
export const PLANTILLA_RUTA = Symbol('PLANTILLA_RUTA');
