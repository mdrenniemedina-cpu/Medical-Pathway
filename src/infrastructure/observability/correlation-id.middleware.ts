import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { requestContextStorage } from './request-context';

const HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.header(HEADER) as string | undefined) ?? nanoid();
    res.setHeader(HEADER, correlationId);
    requestContextStorage.run({ correlationId }, () => next());
  }
}
