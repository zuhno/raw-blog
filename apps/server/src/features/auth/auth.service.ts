import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { google } from "googleapis";
import { Repository } from "typeorm";

import { GoogleExchangeDto } from "./dto/google-exchange.dto";
import { Auth } from "./entities/auth.entity";
import { SignupPlatform } from "../../shared/utils/type";
import type { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async issueAccessToken(user: User) {
    const payload = { ...user };
    const token = await this.jwtService.signAsync(payload, { expiresIn: "15m" });
    return token;
  }

  async issueRefreshToken(user: User, userAgent: string) {
    const newAuthSession = this.authRepository.create({
      platform: SignupPlatform.GOOGLE,
      user,
      userAgent,
    });
    const authSession = await this.authRepository.save(newAuthSession);
    const payload = { jti: authSession.id };
    const token = await this.jwtService.signAsync(payload, { expiresIn: "7d" });
    return token;
  }

  async googleExchange(googleExchangeDto: GoogleExchangeDto, userAgent: string) {
    const { code } = googleExchangeDto;

    const oauth2Client = new google.auth.OAuth2(
      this.configService.get("GOOGLE_OAUTH_CLIENT_ID"),
      this.configService.get("GOOGLE_OAUTH_CLIENT_SECRET"),
      this.configService.get("GOOGLE_OAUTH_REDIRECT_URI")
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfo = await oauth2.userinfo.get();

    const { email, name, picture } = userInfo.data;

    const user = await this.usersService.findAndCreate({
      email: email!,
      nickname: name!,
      avatarUrl: picture!,
    });

    const accessToken = await this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user, userAgent);

    return { accessToken, refreshToken };
  }
}
