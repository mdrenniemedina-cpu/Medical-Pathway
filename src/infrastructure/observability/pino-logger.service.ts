import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';
import { getCorrelationId } from './request-context';

/**
 * Logger estructurado (JSON) para toda la aplicación, con correlationId
 * adjunto automáticamente en cada línea cuando existe un request en curso.
 * Sustituye al logger por defecto de Nest en `main.ts` (`bufferLogs` +
 * `useLogger`).
 */
@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
      formatters: { level: (label) => ({ level: label }) },
    });
  }

  private withContext(): pino.Logger {
    const correlationId = getCorrelationId();
    return correlationId ? this.logger.child({ correlationId }) : this.logger;
  }

  log(message: unknown, context?: string): void {
    this.withContext().info({ context }, String(message));
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.withContext().error({ context, trace }, String(message));
  }

  warn(message: unknown, context?: string): void {
    this.withContext().warn({ context }, String(message));
  }

  debug(message: unknown, context?: string): void {
    this.withContext().debug({ context }, String(message));
  }

  verbose(message: unknown, context?: string): void {
    this.withContext().trace({ context }, String(message));
  }
}
