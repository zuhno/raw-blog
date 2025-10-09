import { applyDecorators, UseGuards } from "@nestjs/common";

import { BotGuard } from "../guards/bot.guard";

export function BotFilter() {
  return applyDecorators(UseGuards(BotGuard()));
}
