import { Module } from '@nestjs/common';
import { HistoriasController } from './historias.controller';
import { AdminHistoriasController } from './admin-historias.controller';
import { HistoriaMedicoRepository } from './historia-medico.repository';
import { AdminBasicAuthGuard } from './admin-basic-auth.guard';

@Module({
  controllers: [HistoriasController, AdminHistoriasController],
  providers: [HistoriaMedicoRepository, AdminBasicAuthGuard],
})
export class HistoriasModule {}
