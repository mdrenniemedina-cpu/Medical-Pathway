import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  REGISTRO_EXPEDIENTE_REPOSITORY,
  RegistroExpedienteRepositoryPort,
} from '../domain/registro-expediente.repository.port';
import { ResultadoResolucion } from '../domain/value-objects/resultado-resolucion.vo';
import { EstadoResolucion } from '../domain/value-objects/resultado-resolucion.vo';
import { detectarOutlierEstadistico } from '../domain/servicios/detector-anomalias.service';

export interface DatosActualizarResolucion {
  registroId: string;
  estado: Exclude<EstadoResolucion, 'pendiente'>;
  fechaResolucion: Date;
  fechaEnvioReferencia: Date;
}

/**
 * Tras registrar la resolución, se consulta la media/desviación de la
 * cohorte para decidir si este dato es un outlier estadístico — si lo es,
 * se marca para revisión humana (nunca se rechaza automáticamente, ver
 * `13-calidad-confianza-datos-radar.md` §3).
 */
@Injectable()
export class ActualizarResolucionUseCase {
  constructor(@Inject(REGISTRO_EXPEDIENTE_REPOSITORY) private readonly registros: RegistroExpedienteRepositoryPort) {}

  async ejecutar(datos: DatosActualizarResolucion): Promise<void> {
    const registro = await this.registros.buscarPorId(datos.registroId);
    if (!registro) throw new NotFoundException('Registro de expediente no encontrado.');

    const resultado = ResultadoResolucion.resuelto(datos.estado, datos.fechaResolucion, datos.fechaEnvioReferencia);
    registro.actualizarResolucion(resultado);

    const diasReportados = Math.round(
      (datos.fechaResolucion.getTime() - datos.fechaEnvioReferencia.getTime()) / (1000 * 60 * 60 * 24),
    );
    const stats = await this.registros.obtenerEstadisticasCohorte(
      registro.tipoExpediente.destinoId,
      registro.tipoExpediente.rutaHomologacionId,
      registro.ventanaEnvio.anio,
      registro.ventanaEnvio.trimestre,
    );
    const deteccion = detectarOutlierEstadistico(diasReportados, stats?.media, stats?.desviacionEstandar);
    if (deteccion.esAnomalo && deteccion.motivo) {
      registro.marcarComoAnomalo(deteccion.motivo);
    }

    await this.registros.guardar(registro);
  }
}
