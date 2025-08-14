import { applyDecorators, UseGuards } from "@nestjs/common";

import { JwtGuard } from "../guards/jwt.guard";

export function RequireUser() {
  return applyDecorators(UseGuards(JwtGuard));
}
