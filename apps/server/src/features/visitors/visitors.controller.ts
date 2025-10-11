import { randomUUID } from "crypto";

import { Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

import { VisitorsService } from "./visitors.service";
import { BotFilter } from "../../shared/decorators/bot-filter.decorator";
import {
  COOKIE_KEY_VISITOR_ID,
  COOKIE_POLICY_VISITOR_ID,
} from "../../shared/utils/constant";
import { getClientIpFromHeaders } from "../../shared/utils/ip";

@Controller()
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post("log")
  @BotFilter()
  async logVisitor(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const ip = getClientIpFromHeaders(req);
    let visitorId: string = req.cookies[COOKIE_KEY_VISITOR_ID];

    if (!visitorId) {
      visitorId = randomUUID();
      res.cookie(COOKIE_KEY_VISITOR_ID, visitorId, COOKIE_POLICY_VISITOR_ID);
    }

    await this.visitorsService.logVisitor(visitorId, ip);
  }
}
