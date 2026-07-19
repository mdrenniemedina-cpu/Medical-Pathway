import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RESULTADO_REPOSITORY, ResultadoRepositoryPort } from '../domain/descubrimiento.repository.port';

@Injectable()
export class SeleccionarDestinoUseCase {
  constructor(@Inject(RESULTADO_REPOSITORY) private readonly resultados: ResultadoRepositoryPort) {}

  async ejecutar(resultadoId: string, destinoId: string): Promise<void> {
    const resultado = await this.resultados.buscarPorId(resultadoId);
    if (!resultado) throw new NotFoundException('Resultado de descubrimiento no encontrado.');
    resultado.seleccionarDestino(destinoId);
    await this.resultados.guardar(resultado);
  }
}
