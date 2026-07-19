import { Injectable } from '@nestjs/common';
import { CatalogoQueryService, DestinoView } from '@contexts/catalogo/public-api';
import { DestinosParaCompararPort } from '../application/ports/destinos-para-comparar.port';
import { DestinoParaComparar } from '../domain/servicios/motor-compatibilidad.service';

/**
 * Anti-Corruption Layer hacia el Catálogo: traduce `DestinoView` (la vista
 * pública del Catálogo, con fuente/fecha en cada campo) a `DestinoParaComparar`
 * (la forma mínima que el motor de compatibilidad de Descubrimiento necesita).
 * El dominio de Descubrimiento nunca ve `DestinoView` ni conoce la existencia
 * de `AtributoConFuente` — eso es vocabulario exclusivo del Catálogo.
 */
@Injectable()
export class CatalogoAcl implements DestinosParaCompararPort {
  constructor(private readonly catalogo: CatalogoQueryService) {}

  async listar(): Promise<DestinoParaComparar[]> {
    const destinos = await this.catalogo.listarDestinos();
    return destinos.map(this.traducir);
  }

  private traducir(destino: DestinoView): DestinoParaComparar {
    return {
      destinoId: destino.id,
      nombre: destino.nombre,
      idiomaRequerido: destino.idiomaRequerido,
      nivelDemanda: destino.nivelDemanda.valor as DestinoParaComparar['nivelDemanda'],
      tiempoTipicoMeses: destino.tiempoTipicoMeses.valor,
      complejidadRegulatoria: destino.complejidadRegulatoria.valor as DestinoParaComparar['complejidadRegulatoria'],
    };
  }
}
