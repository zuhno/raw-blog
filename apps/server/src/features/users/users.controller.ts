import { Controller, Get } from "@nestjs/common";

import { UsersService } from "./users.service";
import { RequestUser } from "../../shared/decorators/request-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import type { TRequestUser } from "../../shared/utils/type";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @RequireUser()
  me(@RequestUser() user: TRequestUser) {
    return this.usersService.findById(user.id);
  }
}
