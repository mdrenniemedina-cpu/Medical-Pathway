import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PinoLoggerService } from '@infrastructure/observability/pino-logger.service';
import { HttpExceptionFilter } from '@infrastructure/observability/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLoggerService));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  // Prefijo global de API (ver `07-api-contracts.md`) — deja la raíz '/' libre
  // para el frontend estático servido por ServeStaticModule (Sprint 1).
  app.setGlobalPrefix('api/v1');

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}

bootstrap();
