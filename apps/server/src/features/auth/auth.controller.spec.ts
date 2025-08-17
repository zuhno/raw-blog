import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import type { Response } from "express";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ALLOWED_ORIGINS } from "../../config/tokens";
import { UserGuard } from "../../shared/guards/user.guard";

function createRes() {
  return { cookie: jest.fn() };
}

describe("AuthController", () => {
  let controller: AuthController;

  const serviceMock = {
    exchangeGoogleCode: jest.fn().mockResolvedValue({
      accessToken: "access.token.mock",
      refreshToken: "refresh.token.mock",
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: serviceMock },

        { provide: ALLOWED_ORIGINS, useValue: ["http://localhost:5173"] },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn(() => "dummy") },
        },
      ],
    })
      .overrideGuard(UserGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = moduleRef.get(AuthController);
  });

  it("POST /google/exchange: serve user-agent, setup RT cookie, return AT", async () => {
    const headers = { "user-agent": "UA-TEST" };
    const dto = { code: "authcode-1234" };
    const res = createRes();

    const result = await controller.exchangeGoogleCode(headers, dto, res as unknown as Response);

    expect(serviceMock.exchangeGoogleCode).toHaveBeenCalledWith(dto, "UA-TEST");
    expect(res.cookie).toHaveBeenCalledWith(
      expect.any(String),
      "refresh.token.mock",
      expect.any(Object)
    );
    expect(result).toEqual({ accessToken: "access.token.mock" });
  });
});
