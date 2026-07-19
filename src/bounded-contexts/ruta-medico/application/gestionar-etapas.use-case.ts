import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RUTA_PERSONALIZADA_REPOSITORY, RutaPersonalizadaRepositoryPort } from '../domain/ruta-personalizada.repository.port';
import { RutaPersonalizadaView, toRutaPersonalizadaView } from './ruta-personalizada-view';

@Injectable()
export class GestionarEtapasUseCase {
  constructor(@Inject(RUTA_PERSONALIZADA_REPOSITORY) private readonly rutas: RutaPersonalizadaRepositoryPort) {}

  async obtenerMiRuta(perfilId: string, destinoId: string): Promise<RutaPersonalizadaView> {
    const ruta = await this.rutas.buscarActivaPorPerfilYDestino(perfilId, destinoId);
    if (!ruta) throw new NotFoundException('No hay una ruta personalizada activa para este destino.');
    return toRutaPersonalizadaView(ruta);
  }

  async iniciarEtapa(rutaId: string, etapaId: string): Promise<RutaPersonalizadaView> {
    const ruta = await this.requerirRuta(rutaId);
    ruta.iniciarEtapa(etapaId);
    await this.rutas.guardar(ruta);
    return toRutaPersonalizadaView(ruta);
  }

  async completarEtapa(rutaId: string, etapaId: string): Promise<RutaPersonalizadaView> {
    const ruta = await this.requerirRuta(rutaId);
    ruta.completarEtapa(etapaId);
    await this.rutas.guardar(ruta);
    return toRutaPersonalizadaView(ruta);
  }

  private async requerirRuta(rutaId: string) {
    const ruta = await this.rutas.buscarPorId(rutaId);
    if (!ruta) throw new NotFoundException('Ruta personalizada no encontrada.');
    return ruta;
  }
}
