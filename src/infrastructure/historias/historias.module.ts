import { Module } from '@nestjs/common';
import { HistoriasController } from './historias.controller';
import { HistoriaMedicoRepository } from './historia-medico.repository';

@Module({
  controllers: [HistoriasController],
  providers: [HistoriaMedicoRepository],
})
export class HistoriasModule {}
