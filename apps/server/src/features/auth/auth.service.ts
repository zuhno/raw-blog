import { Injectable } from "@nestjs/common";

import { GoogleExchangeDto } from "./dto/google-exchange.dto";

@Injectable()
export class AuthService {
  googleExchange(googleExchangeDto: GoogleExchangeDto) {
    return "";
  }
}
