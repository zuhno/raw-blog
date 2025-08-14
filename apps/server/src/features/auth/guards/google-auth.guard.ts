import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Type,
  mixin,
} from "@nestjs/common";
import type { Request } from "express";

import { ALLOWED_ORIGINS } from "../../../config/tokens";
import type { GoogleExchangeDto } from "../dto/google-exchange.dto";

export type GoogleAuthGuardOptions = {
  requireJson?: boolean;
  requireXrw?: boolean;
  method?: "POST";
  requireCodeInBody?: boolean;
};

export function GoogleAuthGuard(opts: GoogleAuthGuardOptions): Type<CanActivate> {
  @Injectable()
  class Guard implements CanActivate {
    private readonly method = opts.method ?? "POST";
    private readonly requireJson = opts.requireJson ?? true;
    private readonly requireXrw = opts.requireXrw ?? true;
    private readonly requireCodeInBody = opts.requireCodeInBody ?? true;

    constructor(@Inject(ALLOWED_ORIGINS) private readonly allowed: string[]) {}

    canActivate(ctx: ExecutionContext): boolean {
      const req = ctx.switchToHttp().getRequest<Request>();

      if (req.method !== this.method) {
        throw new ForbiddenException(`Only ${this.method} allowed`);
      }

      const origin = req.get("Origin");
      if (!origin || !this.allowed.includes(origin)) {
        throw new ForbiddenException("Bad Origin");
      }

      if (this.requireXrw) {
        const xrw = req.get("X-Requested-With");
        if (xrw !== "XmlHttpRequest") {
          throw new ForbiddenException("Missing/invalid X-Requested-With");
        }
      }

      if (this.requireJson) {
        const ct = req.get("Content-Type") || "";
        if (!ct.toLowerCase().startsWith("application/json")) {
          throw new ForbiddenException("Bad Content-Type");
        }
      }

      if (this.requireCodeInBody) {
        const code = (req.body as GoogleExchangeDto)?.code;
        if (typeof code !== "string" || code.length < 8) {
          throw new BadRequestException("Invalid code");
        }
      }

      return true;
    }
  }

  return mixin(Guard);
}
