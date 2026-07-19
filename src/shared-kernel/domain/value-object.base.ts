/**
 * Value Object base: igualdad por valor, inmutable. Sin dependencias de framework
 * (el dominio nunca importa NestJS, pg, ni nada de infraestructura — ver test/architecture).
 */
export abstract class ValueObject<Props extends object> {
  protected readonly props: Readonly<Props>;

  protected constructor(props: Props) {
    this.props = Object.freeze({ ...props });
  }

  equals(other?: ValueObject<Props>): boolean {
    if (!other) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
