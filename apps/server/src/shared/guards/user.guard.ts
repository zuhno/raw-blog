import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export interface IUserGuardOptions {
  strict: boolean;
}

function extractBearer(h?: string | null): string | null {
  if (!h) return null;
  const [t, v] = h.split(" ");
  return t === "Bearer" && v ? v.trim() : null;
}

export function UserGuard(opts?: IUserGuardOptions): Type<CanActivate> {
  @Injectable()
  class Guard implements CanActivate {
    private isStrict = opts?.strict ?? true;

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const req = ctx.switchToHttp().getRequest<Request>();

      const token = extractBearer(req.header("authorization"));

      if (this.isStrict) {
        if (!token) {
          throw new UnauthorizedException(
            "Missing Authorization: Bearer <token>"
          );
        }
      }

      try {
        const payload = await this.jwtService
          .verifyAsync(token!)
          .catch((err) => {
            if (this.isStrict) throw err;
            else return null;
          });
        req.user = payload;

        return true;
      } catch {
        throw new UnauthorizedException("Invalid or expired token");
      }
    }
  }
  return mixin(Guard);
}
