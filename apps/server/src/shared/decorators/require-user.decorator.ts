import { applyDecorators, UseGuards } from "@nestjs/common";

import { UserGuard } from "../guards/user.guard";

export function RequireUser() {
  return applyDecorators(UseGuards(UserGuard));
}
