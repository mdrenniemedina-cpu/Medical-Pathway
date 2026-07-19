import { PerfilInternacional } from '../domain/perfil-internacional.aggregate';

/**
 * "Published Language" (DDD) de este contexto: la única forma en que otros
 * bounded contexts (Descubrimiento, Ruta del Médico, Notificaciones) deben
 * leer datos de un perfil. Nunca se exporta el agregado `PerfilInternacional`
 * en sí desde `public-api` — solo este snapshot inmutable de solo lectura.
 */
export interface PerfilSnapshot {
  perfilId: string;
  cuentaId: string;
  nivelVerificacion: string;
  formacionAcademica: Array<{ universidad: string; paisGraduacion: string; tipoTitulo: string; especialidad?: string }>;
  idiomas: Array<{ idioma: string; nivel: string }>;
  presupuesto?: { rango: string; moneda: string };
  objetivos?: { urgencia: string; toleranciaExamenCompetitivo: string; prioridadIngresoVsRapidez: string };
  puedeRecibirRecomendaciones: boolean;
}

export function toPerfilSnapshot(perfil: PerfilInternacional): PerfilSnapshot {
  return {
    perfilId: perfil.id,
    cuentaId: perfil.cuentaId,
    nivelVerificacion: perfil.nivelVerificacion,
    formacionAcademica: perfil.formacionAcademica.map((f) => ({
      universidad: f.universidad,
      paisGraduacion: f.paisGraduacion,
      tipoTitulo: f.tipoTitulo,
      especialidad: f.especialidad,
    })),
    idiomas: perfil.idiomas.map((i) => ({ idioma: i.idioma, nivel: i.nivel })),
    presupuesto: perfil.situacionEconomica
      ? { rango: perfil.situacionEconomica.rangoPresupuesto, moneda: perfil.situacionEconomica.moneda }
      : undefined,
    objetivos: perfil.objetivosProfesionales
      ? {
          urgencia: perfil.objetivosProfesionales.urgencia,
          toleranciaExamenCompetitivo: perfil.objetivosProfesionales.toleranciaExamenCompetitivo,
          prioridadIngresoVsRapidez: perfil.objetivosProfesionales.prioridadIngresoVsRapidez,
        }
      : undefined,
    puedeRecibirRecomendaciones: perfil.puedeRecibirRecomendaciones(),
  };
}
