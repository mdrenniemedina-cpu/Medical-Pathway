import { AccesoCursoProps } from './acceso-curso';

export const ACCESO_CURSO_REPOSITORY = Symbol('ACCESO_CURSO_REPOSITORY');

export interface AccesoCursoRepositoryPort {
  buscar(cuentaId: string, cursoId: string): Promise<AccesoCursoProps | null>;
  registrarVisualizacion(cuentaId: string, cursoId: string, recurso: string): Promise<void>;
}
