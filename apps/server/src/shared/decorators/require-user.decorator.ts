import { applyDecorators, UseGuards } from "@nestjs/common";

import { type IUserGuardOptions, UserGuard } from "../guards/user.guard";

/**
 * @param opts.strict activate throw an error. default true
 */
export function RequireUser(opts?: IUserGuardOptions) {
  return applyDecorators(UseGuards(UserGuard(opts)));
}
