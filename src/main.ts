import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PinoLoggerService } from '@infrastructure/observability/pino-logger.service';
import { HttpExceptionFilter } from '@infrastructure/observability/http-exception.filter';

/**
 * Orígenes permitidos por CORS, vía CORS_ALLOWED_ORIGINS (coma-separado).
 * Sin la variable definida, solo permite el propio origen local (Sprint 0-1:
 * frontend servido por ServeStaticModule desde el mismo proceso) — nunca
 * abre CORS a cualquier origen por defecto (ver ADR-024, requisito de la
 * beta cerrada: CORS debe permitir exclusivamente el dominio de Vercel de
 * la beta y los orígenes locales necesarios para desarrollo).
 */
function origenesCorsPermitidos(config: ConfigService): string[] {
  const crudo = config.get<string>('CORS_ALLOWED_ORIGINS');
  if (!crudo) return ['http://localhost:3000'];
  return crudo.split(',').map((origen) => origen.trim()).filter(Boolean);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLoggerService));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = app.get(ConfigService);
  app.enableCors({
    origin: origenesCorsPermitidos(config),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // Prefijo global de API (ver `07-api-contracts.md`) — deja la raíz '/' libre
  // para el frontend estático servido por ServeStaticModule (Sprint 1).
  app.setGlobalPrefix('api/v1');

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}

bootstrap();
