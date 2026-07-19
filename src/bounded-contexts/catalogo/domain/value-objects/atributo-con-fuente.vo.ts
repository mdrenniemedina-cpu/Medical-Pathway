import { ValueObject } from '@shared-kernel/domain/value-object.base';
import { DomainError } from '@shared-kernel/domain/domain-error';

interface AtributoConFuenteProps<T> {
  valor: T;
  fuenteUrl: string;
  fechaVerificacion: Date;
}

/**
 * INVARIANTE CENTRAL DEL CATÁLOGO (ver `05-domain-model-ddd.md` §5 y
 * `decisions/ADR-005`): es imposible, a nivel de tipo, construir un dato de
 * hecho sobre un destino u orden ruta sin su fuente y fecha de verificación.
 * Esta clase es la traducción literal a código de "transparencia como
 * feature, no como nota legal". Cualquier intento de omitir `fuenteUrl` o
 * `fechaVerificacion` lanza `DomainError` — ver
 * `test/architecture/invariantes.catalogo.spec.ts`.
 */
export class AtributoConFuente<T> extends ValueObject<AtributoConFuenteProps<T>> {
  static crear<T>(valor: T, fuenteUrl: string, fechaVerificacion: Date): AtributoConFuente<T> {
    if (!fuenteUrl?.trim()) {
      throw new DomainError(
        'Todo dato del catálogo debe tener una fuente verificable (fuenteUrl).',
        'ATRIBUTO_SIN_FUENTE',
      );
    }
    if (!fechaVerificacion || Number.isNaN(fechaVerificacion.getTime())) {
      throw new DomainError(
        'Todo dato del catálogo debe tener una fecha de verificación válida.',
        'ATRIBUTO_SIN_FECHA_VERIFICACION',
      );
    }
    if (fechaVerificacion.getTime() > Date.now()) {
      throw new DomainError('La fecha de verificación no puede ser futura.', 'ATRIBUTO_FECHA_VERIFICACION_FUTURA');
    }
    return new AtributoConFuente({ valor, fuenteUrl, fechaVerificacion });
  }

  get valor(): T {
    return this.props.valor;
  }

  get fuenteUrl(): string {
    return this.props.fuenteUrl;
  }

  get fechaVerificacion(): Date {
    return this.props.fechaVerificacion;
  }
}
