import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

export const RequestUser = createParamDecorator(
  (_d: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    return req.user ?? null;
  }
);
