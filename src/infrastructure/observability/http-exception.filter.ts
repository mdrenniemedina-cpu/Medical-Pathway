import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '@shared-kernel/domain/domain-error';
import { getCorrelationId } from './request-context';

/**
 * Traduce errores a un formato uniforme (ver `docs/07-api-contracts.md`).
 * `DomainError` (violación de invariante de negocio) se traduce a 422,
 * nunca a 500 — un error de dominio no es un bug del sistema.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = getCorrelationId();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Ha ocurrido un error inesperado.';

    if (exception instanceof DomainError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = HttpStatus[status] ?? 'HTTP_ERROR';
      const body = exception.getResponse();
      message = typeof body === 'string' ? body : ((body as { message?: string }).message ?? exception.message);
    } else {
      this.logger.error(`Error no controlado en ${request.method} ${request.url}: ${(exception as Error)?.message}`, (exception as Error)?.stack);
    }

    response.status(status).json({
      error: { code, message, correlationId },
    });
  }
}
