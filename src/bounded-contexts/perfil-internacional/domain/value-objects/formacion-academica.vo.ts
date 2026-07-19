import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

export type TipoTitulo = 'pregrado' | 'especialidad' | 'subespecialidad';

interface FormacionAcademicaProps {
  universidad: string;
  paisGraduacion: string;
  anioGraduacion?: number;
  tipoTitulo: TipoTitulo;
  especialidad?: string;
}

export class FormacionAcademica extends ValueObject<FormacionAcademicaProps> {
  static crear(props: FormacionAcademicaProps): FormacionAcademica {
    if (!props.universidad?.trim()) {
      throw new DomainError('La universidad es obligatoria.', 'FORMACION_UNIVERSIDAD_REQUERIDA');
    }
    if (!props.paisGraduacion?.trim()) {
      throw new DomainError('El país de graduación es obligatorio.', 'FORMACION_PAIS_REQUERIDO');
    }
    return new FormacionAcademica(props);
  }

  get universidad(): string {
    return this.props.universidad;
  }

  get paisGraduacion(): string {
    return this.props.paisGraduacion;
  }

  get tipoTitulo(): TipoTitulo {
    return this.props.tipoTitulo;
  }

  get especialidad(): string | undefined {
    return this.props.especialidad;
  }
}
