/**
 * Módulo privado de Academy (MVP de un solo curso/un solo estudiante,
 * deliberadamente aislado para poder reutilizarse si en el futuro se
 * construye una Academy completa). El acceso se concede/revoca con un
 * UPDATE directo en `academia_privada.acceso_curso` (instrucción explícita
 * del founder: "poder habilitar y deshabilitar el acceso fácilmente desde
 * la base de datos") — por eso este módulo no tiene comandos de
 * aplicación para crear/editar accesos, solo para consultarlos.
 */
export interface AccesoCursoProps {
  id: string;
  cuentaId: string;
  cursoId: string;
  habilitado: boolean;
  fechaExpiracion: Date | null;
}

/** Único invariante real del módulo: vigente = habilitado Y (sin expiración O expiración futura). */
export function accesoVigente(acceso: AccesoCursoProps | null, ahora: Date = new Date()): boolean {
  if (!acceso) return false;
  if (!acceso.habilitado) return false;
  if (acceso.fechaExpiracion && acceso.fechaExpiracion.getTime() <= ahora.getTime()) return false;
  return true;
}

export const RECURSOS_CURSO_REPORTE_CASO = ['video-1', 'video-2', 'video-3', 'guia-care'] as const;
export type RecursoCurso = (typeof RECURSOS_CURSO_REPORTE_CASO)[number];
