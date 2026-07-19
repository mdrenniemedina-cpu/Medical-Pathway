import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

export type NivelIdioma = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'nativo';
const NIVELES_VALIDOS: NivelIdioma[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'nativo'];

interface CompetenciaIdiomaticaProps {
  idioma: string;
  nivel: NivelIdioma;
}

export class CompetenciaIdiomatica extends ValueObject<CompetenciaIdiomaticaProps> {
  static crear(idioma: string, nivel: string): CompetenciaIdiomatica {
    if (!idioma?.trim()) {
      throw new DomainError('El idioma es obligatorio.', 'IDIOMA_REQUERIDO');
    }
    if (!NIVELES_VALIDOS.includes(nivel as NivelIdioma)) {
      throw new DomainError(`Nivel de idioma inválido: ${nivel}.`, 'NIVEL_IDIOMA_INVALIDO');
    }
    return new CompetenciaIdiomatica({ idioma: idioma.toLowerCase().trim(), nivel: nivel as NivelIdioma });
  }

  get idioma(): string {
    return this.props.idioma;
  }

  get nivel(): NivelIdioma {
    return this.props.nivel;
  }
}
