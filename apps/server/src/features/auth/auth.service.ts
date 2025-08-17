import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
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

  private async googleOAuthProcess(code: string) {
    try {
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

      return { email, name, picture };
    } catch {
      throw new BadRequestException("Invalid google code");
    }
  }

  private async issueAccessToken(user: User) {
    const payload = { ...user };
    const token = await this.jwtService.signAsync(payload, { expiresIn: "15m" });
    return token;
  }

  private async issueRefreshToken(user: User, userAgent: string, platform: SignupPlatform) {
    const newAuthSession = this.authRepository.create({
      user,
      userAgent,
      platform,
    });
    const authSession = await this.authRepository.save(newAuthSession);
    const payload = { jti: authSession.id };
    const token = await this.jwtService.signAsync(payload, { expiresIn: "7d" });
    return token;
  }

  async exchangeGoogleCode(googleExchangeDto: GoogleExchangeDto, userAgent: string) {
    const { code } = googleExchangeDto;

    const { email, name, picture } = await this.googleOAuthProcess(code);

    const user = await this.usersService.findAndCreate({
      email: email!,
      nickname: name!,
      avatarUrl: picture!,
    });

    const accessToken = await this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user, userAgent, SignupPlatform.GOOGLE);

    return { accessToken, refreshToken };
  }

  // Refresh Token Rotation
  async reissueAccessToken(prevRefreshToken?: string) {
    if (!prevRefreshToken) throw new UnauthorizedException("Refresh token is required");

    const { jti }: { jti: string } = await this.jwtService.verifyAsync(prevRefreshToken);
    const auth = await this.authRepository.findOne({ where: { id: jti }, relations: ["user"] });

    if (!auth) throw new NotFoundException("Unknown user token");

    const isInvalidAuth = auth.used || auth.invalid || auth.logout;
    if (isInvalidAuth) throw new BadRequestException("Invalid refresh token");

    const newAccessToken = await this.issueAccessToken(auth.user);
    const newRefreshToken = await this.issueRefreshToken(auth.user, auth.userAgent, auth.platform);

    await this.authRepository.update(jti, { used: true });

    return { newAccessToken, newRefreshToken };
  }

  async signout(refreshToken: string) {
    const { jti }: { jti: string } = this.jwtService.decode(refreshToken);
    await this.authRepository.update(jti, { logout: true });
  }
}
