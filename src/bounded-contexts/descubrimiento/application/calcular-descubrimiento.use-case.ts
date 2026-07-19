import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ResultadoDescubrimiento } from '../domain/resultado-descubrimiento.aggregate';
import { calcularPuntuaciones } from '../domain/servicios/motor-compatibilidad.service';
import { AccionRecomendada, analizarBrechas } from '../domain/servicios/analizador-brechas.service';
import {
  RESULTADO_REPOSITORY,
  ResultadoRepositoryPort,
  REGLA_COMPATIBILIDAD_REPOSITORY,
  ReglaCompatibilidadRepositoryPort,
} from '../domain/descubrimiento.repository.port';
import { PERFIL_PARA_COMPARAR, PerfilParaCompararPort } from './ports/perfil-para-comparar.port';
import { DESTINOS_PARA_COMPARAR, DestinosParaCompararPort } from './ports/destinos-para-comparar.port';
import { ResultadoDescubrimientoView, toResultadoView } from './resultado-view';

@Injectable()
export class CalcularDescubrimientoUseCase {
  constructor(
    @Inject(PERFIL_PARA_COMPARAR) private readonly perfiles: PerfilParaCompararPort,
    @Inject(DESTINOS_PARA_COMPARAR) private readonly destinos: DestinosParaCompararPort,
    @Inject(REGLA_COMPATIBILIDAD_REPOSITORY) private readonly reglas: ReglaCompatibilidadRepositoryPort,
    @Inject(RESULTADO_REPOSITORY) private readonly resultados: ResultadoRepositoryPort,
  ) {}

  async ejecutar(perfilId: string): Promise<ResultadoDescubrimientoView> {
    const [perfil, destinos, reglasActivas] = await Promise.all([
      this.perfiles.obtener(perfilId),
      this.destinos.listar(),
      this.reglas.listarActivas(),
    ]);

    const puntuaciones = calcularPuntuaciones(perfil, destinos, reglasActivas);
    const reglasVersion = reglasActivas[0]?.version ?? 1;
    const resultado = ResultadoDescubrimiento.crear(nanoid(), perfilId, reglasVersion, puntuaciones);
    await this.resultados.guardar(resultado);

    const accionesPorDestino = new Map<string, AccionRecomendada[]>();
    for (const destino of destinos) {
      accionesPorDestino.set(destino.destinoId, analizarBrechas(perfil, destino, reglasActivas));
    }
    return toResultadoView(resultado, accionesPorDestino);
  }
}
