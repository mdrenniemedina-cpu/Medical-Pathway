import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PersistenceModule } from '@infrastructure/persistence/persistence.module';
import { EventsModule } from '@infrastructure/events/events.module';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { CorrelationIdMiddleware } from '@infrastructure/observability/correlation-id.middleware';
import { IdentidadAccesoModule } from '@contexts/identidad-acceso/public-api';
import { PerfilInternacionalModule } from '@contexts/perfil-internacional/public-api';
import { CatalogoModule } from '@contexts/catalogo/public-api';
import { DescubrimientoModule } from '@contexts/descubrimiento/public-api';
import { RutaMedicoModule } from '@contexts/ruta-medico/public-api';
import { RadarEsperaModule } from '@contexts/radar-espera/public-api';
import { ComunidadModule } from '@contexts/comunidad/public-api';
import { OportunidadesModule } from '@contexts/oportunidades/public-api';
import { NotificacionesModule } from '@contexts/notificaciones/public-api';
import { AnalyticsModule } from '@infrastructure/analytics/analytics.module';
import { HistoriasModule } from '@infrastructure/historias/historias.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

/**
 * Composition root del monolito modular. El orden de `imports` no es
 * arbitrario: refleja las dependencias permitidas del context map
 * (`05-domain-model-ddd.md` §3) — cada módulo importa únicamente la
 * `public-api` de los contextos de los que depende, nunca al revés
 * (Identidad no importa Perfil, Perfil no importa Descubrimiento, etc.).
 * `test/architecture/boundaries.spec.ts` verifica esto automáticamente
 * sobre el código fuente, no solo sobre este archivo.
 */
@Module({
  imports: [
    ConfigModule,
    PersistenceModule,
    EventsModule,
    ObservabilityModule,
    IdentidadAccesoModule,
    PerfilInternacionalModule,
    CatalogoModule,
    DescubrimientoModule,
    RutaMedicoModule,
    RadarEsperaModule,
    ComunidadModule,
    OportunidadesModule,
    NotificacionesModule,
    AnalyticsModule,
    HistoriasModule,
    // Sirve el frontend mínimo del Sprint 1 (public/) en '/'. La API vive
    // bajo el prefijo global 'api/v1' (ver main.ts) precisamente para que
    // no haya colisión de rutas entre el frontend estático y los endpoints.
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', '..', 'public') }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
