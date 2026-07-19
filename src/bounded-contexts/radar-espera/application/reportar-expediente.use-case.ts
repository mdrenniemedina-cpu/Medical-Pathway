import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { DomainError } from '@shared-kernel/domain/domain-error';
import {
  REGISTRO_EXPEDIENTE_REPOSITORY,
  RegistroExpedienteRepositoryPort,
} from '../domain/registro-expediente.repository.port';
import { RegistroExpediente } from '../domain/registro-expediente.aggregate';
import { TipoExpediente } from '../domain/value-objects/tipo-expediente.vo';
import { VentanaEnvio } from '../domain/value-objects/ventana-envio.vo';
import { calcularConfianzaInicial } from '../domain/servicios/calculador-confianza.service';
import { PERFIL_VERIFICACION, PerfilVerificacionPort } from './ports/perfil-verificacion.port';

export interface DatosReporteExpediente {
  perfilId: string;
  destinoId: string;
  rutaHomologacionId: string;
  region?: string;
  especialidad?: string;
  anioEnvio: number;
  trimestreEnvio: number;
}

/**
 * Reciprocidad de datos (ver `decisions/ADR-014`): este caso de uso es el
 * que un usuario invoca voluntariamente para contribuir su propio expediente
 * — es lo que desbloquea el detalle completo de su cohorte en
 * `ConsultarMiCohorteUseCase`. La invariante "un registro activo por
 * perfil+destino+ruta" se aplica aquí antes de crear uno nuevo.
 */
@Injectable()
export class ReportarExpedienteUseCase {
  constructor(
    @Inject(REGISTRO_EXPEDIENTE_REPOSITORY) private readonly registros: RegistroExpedienteRepositoryPort,
    @Inject(PERFIL_VERIFICACION) private readonly perfiles: PerfilVerificacionPort,
  ) {}

  async ejecutar(datos: DatosReporteExpediente): Promise<RegistroExpediente> {
    const existente = await this.registros.buscarPorPerfilDestinoRuta(
      datos.perfilId,
      datos.destinoId,
      datos.rutaHomologacionId,
    );
    if (existente?.confirmadoPorUsuario) {
      throw new DomainError(
        'Ya tienes un expediente activo reportado para este destino y ruta.',
        'REGISTRO_EXPEDIENTE_YA_EXISTE',
      );
    }

    const nivelVerificacion = await this.perfiles.obtenerNivelVerificacion(datos.perfilId);
    const confianza = calcularConfianzaInicial(nivelVerificacion, 0);

    const registro =
      existente ??
      RegistroExpediente.crearBorrador(
        nanoid(),
        datos.perfilId,
        TipoExpediente.crear({
          destinoId: datos.destinoId,
          rutaHomologacionId: datos.rutaHomologacionId,
          region: datos.region,
          especialidad: datos.especialidad,
        }),
        VentanaEnvio.crear(datos.anioEnvio, datos.trimestreEnvio),
      );
    registro.confirmar(confianza);
    await this.registros.guardar(registro);
    return registro;
  }
}
