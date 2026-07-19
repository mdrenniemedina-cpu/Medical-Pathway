import { Module } from '@nestjs/common';
import { PerfilInternacionalModule } from '@contexts/perfil-internacional/public-api';
import { CatalogoModule } from '@contexts/catalogo/public-api';
import { NotificacionesController } from './notificaciones.controller';
import { RegistrarEventosSubscriber } from './registrar-eventos.subscriber';

@Module({
  imports: [PerfilInternacionalModule, CatalogoModule],
  controllers: [NotificacionesController],
  providers: [RegistrarEventosSubscriber],
})
export class NotificacionesModule {}
