import { RutaHomologacion } from '../domain/ruta-homologacion.aggregate';

export interface EtapaRutaView {
  id: string;
  orden: number;
  nombre: string;
  tipo: string;
  duracionTipicaDias: { valor: number; fuenteUrl: string; fechaVerificacion: string };
  esConfigurablePorPerfil: boolean;
  prerequisitoEtapaId?: string;
}

export interface RutaHomologacionView {
  id: string;
  destinoId: string;
  nombre: string;
  version: number;
  etapas: EtapaRutaView[];
}

export function toRutaHomologacionView(ruta: RutaHomologacion): RutaHomologacionView {
  return {
    id: ruta.id,
    destinoId: ruta.destinoId,
    nombre: ruta.nombre,
    version: ruta.version,
    etapas: ruta.etapas.map((e) => ({
      id: e.id,
      orden: e.orden,
      nombre: e.nombre,
      tipo: e.tipo,
      duracionTipicaDias: {
        valor: e.duracionTipicaDias.valor,
        fuenteUrl: e.duracionTipicaDias.fuenteUrl,
        fechaVerificacion: e.duracionTipicaDias.fechaVerificacion.toISOString(),
      },
      esConfigurablePorPerfil: e.esConfigurablePorPerfil,
      prerequisitoEtapaId: e.prerequisitoEtapaId,
    })),
  };
}
