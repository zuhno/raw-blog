import { Controller, Post, Body, UseGuards, Get, Headers, Res } from "@nestjs/common";
import type { Response } from "express";

import { AuthService } from "./auth.service";
import { GoogleExchangeDto } from "./dto/google-exchange.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { ReqUser } from "../../shared/decorators/req-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import { COOKIE_KEY_REFRESH_TOKEN, COOKIE_POLICY_REFRESH_TOKEN } from "../../shared/utils/constant";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("google/exchange")
  @UseGuards(
    GoogleAuthGuard({
      requireJson: true,
      requireXrw: true,
      method: "POST",
      requireCodeInBody: true,
    })
  )
  async googleExchangeByCode(
    @Headers() headers: Request["headers"],
    @Body() googleExchangeDto: GoogleExchangeDto,
    @Res() res: Response
  ) {
    const userAgent = headers["user-agent"] as string;
    const { accessToken, refreshToken } = await this.authService.googleExchange(
      googleExchangeDto,
      userAgent
    );
    res.cookie(COOKIE_KEY_REFRESH_TOKEN, refreshToken, {
      ...COOKIE_POLICY_REFRESH_TOKEN,
    });
    return accessToken;
  }

  @Get("test")
  @RequireUser()
  test(@ReqUser() user: any) {
    console.log(user);
    return "";
  }
}
