import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { FormacionAcademica } from './value-objects/formacion-academica.vo';
import { CompetenciaIdiomatica } from './value-objects/competencia-idiomatica.vo';
import { SituacionEconomica } from './value-objects/situacion-economica.vo';
import { ObjetivosProfesionales } from './value-objects/objetivos-profesionales.vo';
import { NivelVerificacion, esAscenso } from './value-objects/nivel-verificacion.vo';
import {
  NivelDeVerificacionElevadoEvent,
  PerfilActualizadoEvent,
  PerfilCreadoEvent,
} from './events/perfil-eventos';

export interface PerfilInternacionalProps {
  id: string;
  cuentaId: string;
  nivelVerificacion: NivelVerificacion;
  formacionAcademica: FormacionAcademica[];
  idiomas: CompetenciaIdiomatica[];
  situacionEconomica?: SituacionEconomica;
  objetivosProfesionales?: ObjetivosProfesionales;
}

/**
 * Concepto central de la plataforma (instrucción explícita del founder):
 * se completa una vez y todo el resto del sistema se deriva de aquí vía
 * eventos — nunca hay una segunda copia de estos datos en otro contexto.
 */
export class PerfilInternacional extends AggregateRoot {
  private constructor(private props: PerfilInternacionalProps) {
    super(props.id);
  }

  static crear(id: string, cuentaId: string): PerfilInternacional {
    const perfil = new PerfilInternacional({
      id,
      cuentaId,
      nivelVerificacion: 'ninguno',
      formacionAcademica: [],
      idiomas: [],
    });
    perfil.raise(new PerfilCreadoEvent(id, { cuentaId, nivelVerificacion: 'ninguno' }));
    return perfil;
  }

  static reconstituir(props: PerfilInternacionalProps): PerfilInternacional {
    return new PerfilInternacional(props);
  }

  agregarFormacionAcademica(formacion: FormacionAcademica): void {
    this.props.formacionAcademica.push(formacion);
    this.notificarActualizacion();
  }

  agregarIdioma(idioma: CompetenciaIdiomatica): void {
    this.props.idiomas = this.props.idiomas.filter((i) => i.idioma !== idioma.idioma);
    this.props.idiomas.push(idioma);
    this.notificarActualizacion();
  }

  actualizarSituacionEconomica(situacion: SituacionEconomica): void {
    this.props.situacionEconomica = situacion;
    this.notificarActualizacion();
  }

  actualizarObjetivosProfesionales(objetivos: ObjetivosProfesionales): void {
    this.props.objetivosProfesionales = objetivos;
    this.notificarActualizacion();
  }

  elevarNivelVerificacion(nuevoNivel: NivelVerificacion): void {
    if (!esAscenso(this.props.nivelVerificacion, nuevoNivel)) {
      throw new DomainError(
        'El nivel de verificación solo puede subir, nunca bajar automáticamente.',
        'NIVEL_VERIFICACION_NO_PUEDE_DESCENDER',
      );
    }
    const anterior = this.props.nivelVerificacion;
    this.props.nivelVerificacion = nuevoNivel;
    this.raise(new NivelDeVerificacionElevadoEvent(this.id, anterior, nuevoNivel));
    this.notificarActualizacion();
  }

  /** Invariante: se requiere al menos una formación académica para que Descubrimiento pueda operar. */
  puedeRecibirRecomendaciones(): boolean {
    return this.props.formacionAcademica.length > 0;
  }

  private notificarActualizacion(): void {
    this.raise(
      new PerfilActualizadoEvent(this.id, {
        cuentaId: this.props.cuentaId,
        nivelVerificacion: this.props.nivelVerificacion,
      }),
    );
  }

  get cuentaId(): string {
    return this.props.cuentaId;
  }

  get nivelVerificacion(): NivelVerificacion {
    return this.props.nivelVerificacion;
  }

  get formacionAcademica(): readonly FormacionAcademica[] {
    return this.props.formacionAcademica;
  }

  get idiomas(): readonly CompetenciaIdiomatica[] {
    return this.props.idiomas;
  }

  get situacionEconomica(): SituacionEconomica | undefined {
    return this.props.situacionEconomica;
  }

  get objetivosProfesionales(): ObjetivosProfesionales | undefined {
    return this.props.objetivosProfesionales;
  }
}
