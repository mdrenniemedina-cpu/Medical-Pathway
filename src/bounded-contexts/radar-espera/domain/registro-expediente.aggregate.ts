import { AggregateRoot } from '@shared-kernel/domain/aggregate-root.base';
import { TipoExpediente } from './value-objects/tipo-expediente.vo';
import { VentanaEnvio } from './value-objects/ventana-envio.vo';
import { ResultadoResolucion } from './value-objects/resultado-resolucion.vo';
import { ConfianzaDato } from './value-objects/confianza-dato.vo';
import {
  AnomaliaDetectadaEvent,
  RegistroDeExpedienteActualizadoEvent,
  RegistroDeExpedienteCreadoEvent,
} from './events/radar-eventos';

export interface RegistroExpedienteProps {
  id: string;
  perfilId: string;
  tipoExpediente: TipoExpediente;
  ventanaEnvio: VentanaEnvio;
  resultado: ResultadoResolucion;
  confianza: ConfianzaDato;
  marcadoAnomalo: boolean;
  confirmadoPorUsuario: boolean;
}

/**
 * Propiedad exclusiva de un usuario (nunca expuesto individualmente a
 * otros — ver `05-domain-model-ddd.md` §8). `confirmadoPorUsuario` existe
 * porque el Anti-Corruption Layer que escucha `EntroAEtapaDeEspera` (ver
 * `infrastructure/ruta-medico.acl.ts`) puede pre-rellenar un borrador con
 * destino/ruta/región ya conocidos por conveniencia, pero solo cuenta para
 * los agregados de cohorte una vez que el propio usuario lo confirma —
 * preserva consentimiento y calidad de dato (ver `decisions/ADR-013`).
 */
export class RegistroExpediente extends AggregateRoot {
  private constructor(private props: RegistroExpedienteProps) {
    super(props.id);
  }

  static crearBorrador(
    id: string,
    perfilId: string,
    tipoExpediente: TipoExpediente,
    ventanaEnvio: VentanaEnvio,
  ): RegistroExpediente {
    const registro = new RegistroExpediente({
      id,
      perfilId,
      tipoExpediente,
      ventanaEnvio,
      resultado: ResultadoResolucion.pendiente(),
      confianza: ConfianzaDato.crear(0),
      marcadoAnomalo: false,
      confirmadoPorUsuario: false,
    });
    return registro;
  }

  static reconstituir(props: RegistroExpedienteProps): RegistroExpediente {
    return new RegistroExpediente(props);
  }

  confirmar(confianzaInicial: ConfianzaDato): void {
    this.props.confirmadoPorUsuario = true;
    this.props.confianza = confianzaInicial;
    this.raise(new RegistroDeExpedienteCreadoEvent(this.id, { perfilId: this.props.perfilId, destinoId: this.props.tipoExpediente.destinoId }));
  }

  actualizarResolucion(resultado: ResultadoResolucion): void {
    this.props.resultado = resultado;
    this.raise(new RegistroDeExpedienteActualizadoEvent(this.id, { estado: resultado.estado }));
  }

  marcarComoAnomalo(motivo: string): void {
    this.props.marcadoAnomalo = true;
    this.raise(new AnomaliaDetectadaEvent(this.id, motivo));
  }

  get perfilId(): string {
    return this.props.perfilId;
  }
  get tipoExpediente(): TipoExpediente {
    return this.props.tipoExpediente;
  }
  get ventanaEnvio(): VentanaEnvio {
    return this.props.ventanaEnvio;
  }
  get resultado(): ResultadoResolucion {
    return this.props.resultado;
  }
  get confianza(): ConfianzaDato {
    return this.props.confianza;
  }
  get marcadoAnomalo(): boolean {
    return this.props.marcadoAnomalo;
  }
  get confirmadoPorUsuario(): boolean {
    return this.props.confirmadoPorUsuario;
  }
}
