import { Module } from '@nestjs/common';
import { DescubrimientoModule } from '@contexts/descubrimiento/public-api';
import { RutaMedicoModule } from '@contexts/ruta-medico/public-api';
import { EventosProductoRepository } from './eventos-producto.repository';
import { AnalyticsController } from './analytics.controller';
import { DominioAAnaliticaSubscriber } from './dominio-a-analitica.subscriber';

@Module({
  imports: [DescubrimientoModule, RutaMedicoModule],
  controllers: [AnalyticsController],
  providers: [EventosProductoRepository, DominioAAnaliticaSubscriber],
})
export class AnalyticsModule {}
