import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from "@nestjs/common";
import type { Request } from "express";

export function BotGuard(): Type<CanActivate> {
  @Injectable()
  class Guard implements CanActivate {
    constructor() {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const req = ctx.switchToHttp().getRequest<Request>();

      const ua = req.header("clientUa") || req.header("user-agent") || "";

      const botKeywords = [
        "bot",
        "crawl",
        "spider",
        "slurp",
        "googlebot",
        "bingbot",
        "yahoo",
        "baiduspider",
        "duckduckbot",
        "yandexbot",
        "sogou",
        "exabot",
        "facebot",
        "ia_archiver",
        "pinterest",
        "linkedinbot",
        "telegrambot",
        "slackbot",
        "whatsapp",
        "twitterbot",
        "discordbot",
        "applebot",
        "semrushbot",
        "mj12bot",
        "ahrefsbot",
        "dotbot",
        "seznambot",
        "uptimerobot",
        "petalbot",
        "yeti",
        "heritrix",
        "archive.org_bot",
        "axios",
        "googleother",
        "headless",
      ];

      const isBot = botKeywords.some((keyword) =>
        ua.toLowerCase().includes(keyword)
      );
      if (isBot) {
        console.log(`detected bot from user-agent: ${ua}`);
        throw new BadRequestException("Bots cannot access it");
      }

      return true;
    }
  }
  return mixin(Guard);
}
