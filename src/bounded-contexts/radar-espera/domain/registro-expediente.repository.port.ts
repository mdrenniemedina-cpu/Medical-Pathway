import { RegistroExpediente } from './registro-expediente.aggregate';

export interface RegistroExpedienteRepositoryPort {
  guardar(registro: RegistroExpediente): Promise<void>;
  buscarPorId(id: string): Promise<RegistroExpediente | null>;
  buscarPorPerfilDestinoRuta(perfilId: string, destinoId: string, rutaHomologacionId: string): Promise<RegistroExpediente | null>;
  /** Para el detector de anomalías: media/desviación estándar de días de resolución de una cohorte, si existen suficientes datos. */
  obtenerEstadisticasCohorte(
    destinoId: string,
    rutaHomologacionId: string,
    anio: number,
    trimestre: number,
  ): Promise<{ media: number; desviacionEstandar: number; n: number } | null>;
}
export const REGISTRO_EXPEDIENTE_REPOSITORY = Symbol('REGISTRO_EXPEDIENTE_REPOSITORY');
