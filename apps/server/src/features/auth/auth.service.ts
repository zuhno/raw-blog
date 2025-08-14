import { Injectable } from "@nestjs/common";

import { GoogleExchangeDto } from "./dto/google-exchange.dto";

@Injectable()
export class AuthService {
  googleExchange(googleExchangeDto: GoogleExchangeDto) {
    const { code } = googleExchangeDto;
    console.log(code);

    // TODO:
    // 1. code 검증
    // 2. AT 발급
    // 3. 구글 사용자 정보 패칭
    // 4. 사용자 등록
    // 5. AT(반환), RT(쿠키세팅 및 DB 적재) 발급 및 저장

    return "";
  }
}
