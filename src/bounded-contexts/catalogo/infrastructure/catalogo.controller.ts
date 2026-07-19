import { Controller, Get, Param } from '@nestjs/common';
import { CatalogoQueryService } from '../application/catalogo-query.service';
import { DestinoView } from '../application/destino-view';
import { RutaHomologacionView } from '../application/ruta-homologacion-view';

@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogo: CatalogoQueryService) {}

  @Get('destinos')
  async listarDestinos(): Promise<DestinoView[]> {
    return this.catalogo.listarDestinos();
  }

  @Get('destinos/:id')
  async obtenerDestino(@Param('id') id: string): Promise<DestinoView> {
    return this.catalogo.obtenerDestino(id);
  }

  @Get('destinos/:id/ruta')
  async obtenerRuta(@Param('id') id: string): Promise<RutaHomologacionView> {
    return this.catalogo.obtenerRutaPublicadaDeDestino(id);
  }
}
