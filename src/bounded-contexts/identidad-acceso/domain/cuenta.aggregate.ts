import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { Rol } from './rol';
import { CuentaRegistradaEvent } from './events/cuenta-registrada.event';

export interface CuentaProps {
  id: string;
  email: string;
  passwordHash: string | null;
  proveedorSso: string | null;
  rol: Rol;
  activa: boolean;
}

/**
 * Deliberadamente NO contiene ningún dato profesional (universidad, idiomas,
 * etc.) — eso vive en `PerfilInternacional`, en su propio bounded context.
 * Ver ADR-011: separar "cómo entro" de "quién soy profesionalmente".
 */
export class Cuenta extends AggregateRoot {
  private constructor(private props: CuentaProps) {
    super(props.id);
  }

  static registrar(params: { id: string; email: string; passwordHash: string }): Cuenta {
    if (!params.email.includes('@')) {
      throw new DomainError('El email no tiene un formato válido.', 'EMAIL_INVALIDO');
    }
    const cuenta = new Cuenta({
      id: params.id,
      email: params.email.toLowerCase().trim(),
      passwordHash: params.passwordHash,
      proveedorSso: null,
      rol: 'usuario',
      activa: true,
    });
    cuenta.raise(new CuentaRegistradaEvent(cuenta.id, { email: cuenta.props.email }));
    return cuenta;
  }

  static reconstituir(props: CuentaProps): Cuenta {
    return new Cuenta(props);
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string | null {
    return this.props.passwordHash;
  }

  get rol(): Rol {
    return this.props.rol;
  }

  get activa(): boolean {
    return this.props.activa;
  }
}
