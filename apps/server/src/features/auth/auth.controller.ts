import { Controller, Post, Body } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { GoogleExchangeDto } from "./dto/google-exchange.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("google/exchange")
  googleExchangeByCode(@Body() googleExchangeDto: GoogleExchangeDto) {
    return this.authService.googleExchange(googleExchangeDto);
  }
}
