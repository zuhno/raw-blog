import { randomUUID } from "node:crypto";

import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { SignupPlatform } from "../../shared/utils/type";
import { UsersService } from "../users/users.service";

jest.mock("googleapis", () => {
  const getToken = jest
    .fn()
    .mockResolvedValue({ tokens: { access_token: "g_at", id_token: "g_id" } });
  const setCredentials = jest.fn();
  const userinfoGet = jest.fn().mockResolvedValue({
    data: { email: "example@example.com", name: "example", picture: "https://img" },
  });

  return {
    __esModule: true,
    google: {
      auth: {
        OAuth2: jest.fn().mockImplementation(() => ({
          getToken,
          setCredentials,
        })),
      },
      oauth2: jest.fn().mockReturnValue({
        userinfo: { get: userinfoGet },
      }),
    },
    __mocks: { getToken, setCredentials, userinfoGet },
  };
});

const { __mocks: gMocks } = jest.requireMock("googleapis");

class JwtServiceMock {
  signAsync = jest.fn((_payload: any, opts?: any) => {
    if (opts?.expiresIn === "15m") return Promise.resolve("access.token.mock");
    if (opts?.expiresIn === "7d") return Promise.resolve("refresh.token.mock");
    return Promise.resolve("token.mock");
  });
}
class ConfigServiceMock {
  get = jest.fn(() => "dummy");
}

const userId = randomUUID();

const authRepoMock: Partial<Record<keyof Repository<Auth>, any>> = {
  create: jest.fn((dto) => ({ ...dto, id: undefined })),
  save: jest.fn((entity) => ({ ...entity, id: "session-uuid" })),
};

const usersServiceMock = {
  findAndCreate: jest.fn(async (input) => ({
    id: userId,
    email: input.email,
    nickname: input.nickname,
    avatarUrl: input.avatarUrl,
  })),
};

describe("AuthService", () => {
  let service: AuthService;
  let jwt: JwtServiceMock;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useClass: JwtServiceMock },
        { provide: ConfigService, useClass: ConfigServiceMock },
        { provide: getRepositoryToken(Auth), useValue: authRepoMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    jwt = moduleRef.get(JwtService);
  });

  it("issueAccessToken: issued 15m token by user payload", async () => {
    const token = await service.issueAccessToken({
      id: userId,
      email: "a@b.c",
      nickname: "nick",
    } as any);
    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ id: userId, email: "a@b.c", nickname: "nick" }),
      expect.objectContaining({ expiresIn: "15m" })
    );
    expect(token).toBe("access.token.mock");
  });

  it("issueRefreshToken: 7d RT with jti when after save session", async () => {
    const token = await service.issueRefreshToken({ id: userId } as any, "UA");
    expect(authRepoMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: SignupPlatform.GOOGLE,
        user: { id: userId },
        userAgent: "UA",
      })
    );
    expect(authRepoMock.save).toHaveBeenCalled();
    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ jti: "session-uuid" }),
      expect.objectContaining({ expiresIn: "7d" })
    );
    expect(token).toBe("refresh.token.mock");
  });

  it("googleExchange: exchange code → userinfo → upsert → issue AT/RT", async () => {
    const { accessToken, refreshToken } = await service.googleExchange(
      { code: "authcode-1234" } as any,
      "UA-STRING"
    );

    // googleapis 호출 검증
    expect(gMocks.getToken).toHaveBeenCalledWith("authcode-1234");
    expect(gMocks.setCredentials).toHaveBeenCalledWith({ access_token: "g_at", id_token: "g_id" });
    expect(gMocks.userinfoGet).toHaveBeenCalled();

    // 유저 생성/조회
    expect(usersServiceMock.findAndCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "example@example.com",
        nickname: "example",
        avatarUrl: "https://img",
      })
    );

    expect(accessToken).toBe("access.token.mock");
    expect(refreshToken).toBe("refresh.token.mock");
  });
});
