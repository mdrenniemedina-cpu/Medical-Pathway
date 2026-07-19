import { Module } from '@nestjs/common';
import { DESTINO_REPOSITORY, RUTA_HOMOLOGACION_REPOSITORY } from '../domain/catalogo.repository.port';
import { DestinoRepositoryPg } from './destino.repository.pg';
import { RutaHomologacionRepositoryPg } from './ruta-homologacion.repository.pg';
import { CatalogoQueryService } from '../application/catalogo-query.service';
import { CatalogoController } from './catalogo.controller';

@Module({
  controllers: [CatalogoController],
  providers: [
    { provide: DESTINO_REPOSITORY, useClass: DestinoRepositoryPg },
    { provide: RUTA_HOMOLOGACION_REPOSITORY, useClass: RutaHomologacionRepositoryPg },
    CatalogoQueryService,
  ],
  exports: [CatalogoQueryService],
})
export class CatalogoModule {}
