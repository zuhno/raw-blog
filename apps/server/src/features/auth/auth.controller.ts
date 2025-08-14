import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { GoogleExchangeDto } from "./dto/google-exchange.dto";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { ReqUser } from "../../shared/decorators/req-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";

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
  googleExchangeByCode(@Body() googleExchangeDto: GoogleExchangeDto) {
    return this.authService.googleExchange(googleExchangeDto);
  }

  @Get("test")
  @RequireUser()
  test(@ReqUser() user: any) {
    console.log(user);
    return "";
  }
}
