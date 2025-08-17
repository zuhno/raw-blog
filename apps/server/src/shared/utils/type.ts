import type { User } from "../../features/users/entities/user.entity";

export enum SignupPlatform {
  GOOGLE = "GOOGLE",
  SLACK = "SLACK",
  META = "META",
  KAKAO = "KAKAO",
}

export type RequestUser = Omit<User, "createdAt" | "updatedAt">;
type ValidCookieKey = "refresh_token";

declare module "express" {
  interface Request {
    user?: RequestUser;
    cookies: { [key in ValidCookieKey]: string };
  }
}
