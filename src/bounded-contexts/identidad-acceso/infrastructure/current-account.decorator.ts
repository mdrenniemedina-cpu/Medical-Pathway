import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';

interface RequestWithAccount {
  user: JwtPayload;
}

/** Extrae `{ sub: cuentaId, rol }` del JWT ya validado por JwtAuthGuard. */
export const CurrentAccount = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest<RequestWithAccount>();
  return request.user;
});
