import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

function extractBearer(h?: string | null): string | null {
  if (!h) return null;
  const [t, v] = h.split(" ");
  return t === "Bearer" && v ? v.trim() : null;
}

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();

    const token = extractBearer(req.header("authorization"));
    if (!token) {
      throw new UnauthorizedException("Missing Authorization: Bearer <token>");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        issuer: "raw-blog-server",
        audience: "raw-blog-client",
        secret: this.configService.get<string>("GOOGLE_SIGNIN_JWT_SECRET"),
      });

      // 3) req.user에 주입
      (req as any).user = payload;
      (req as any).token = token;

      return true;
    } catch {
      // 만료/서명 오류 등 모두 401로
      // 만료시 쿠키에 담긴 리프레시토큰을 활용하여 엑세스토큰 재발급
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
