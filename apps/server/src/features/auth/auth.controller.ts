import { Controller, Post, Body, UseGuards, Headers, Res, Req } from "@nestjs/common";
import type { Response, Request } from "express";

import { AuthService } from "./auth.service";
import { GoogleExchangeDto } from "./dto/google-exchange.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
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
  async exchangeGoogleCode(
    @Headers() headers: Request["headers"],
    @Body() googleExchangeDto: GoogleExchangeDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const userAgent = headers["user-agent"] as string;
    const { accessToken, refreshToken } = await this.authService.exchangeGoogleCode(
      googleExchangeDto,
      userAgent
    );
    response.cookie(COOKIE_KEY_REFRESH_TOKEN, refreshToken, COOKIE_POLICY_REFRESH_TOKEN);

    return { accessToken };
  }

  @Post("refresh")
  async reissueAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const { refresh_token } = request.cookies;

    try {
      const newTokens = await this.authService.reissueAccessToken(refresh_token);
      response.cookie(
        COOKIE_KEY_REFRESH_TOKEN,
        newTokens.newRefreshToken,
        COOKIE_POLICY_REFRESH_TOKEN
      );

      return { accessToken: newTokens.newAccessToken };
    } catch (error) {
      response.clearCookie(COOKIE_KEY_REFRESH_TOKEN, COOKIE_POLICY_REFRESH_TOKEN);
      throw error;
    }
  }

  @Post("signout")
  @RequireUser()
  async signout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const { refresh_token } = request.cookies;

    await this.authService.signout(refresh_token);
    response.clearCookie(COOKIE_KEY_REFRESH_TOKEN, COOKIE_POLICY_REFRESH_TOKEN);

    return true;
  }
}
