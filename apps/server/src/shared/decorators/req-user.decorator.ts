import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

export const ReqUser = createParamDecorator((_d: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();

  const user = (req as any).user;
  if (!user) throw new UnauthorizedException("Authentication required");

  // eslint-disable-next-line
  return user;
});
