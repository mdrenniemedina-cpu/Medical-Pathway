import { RutaPersonalizada } from '../domain/ruta-personalizada.aggregate';

export interface EtapaPersonalizadaView {
  id: string;
  orden: number;
  nombre: string;
  tipo: string;
  estado: string;
  obligatoria: boolean;
}
export interface RutaPersonalizadaView {
  id: string;
  destinoId: string;
  etapas: EtapaPersonalizadaView[];
}

export function toRutaPersonalizadaView(ruta: RutaPersonalizada): RutaPersonalizadaView {
  return {
    id: ruta.id,
    destinoId: ruta.destinoId,
    etapas: ruta.etapas.map((e) => ({
      id: e.id,
      orden: e.orden,
      nombre: e.nombre,
      tipo: e.tipo,
      estado: e.estado,
      obligatoria: e.obligatoria,
    })),
  };
}
