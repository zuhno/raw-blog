import type { User } from "../../features/users/entities/user.entity";

export type Nullable<T> = T | null;

export enum ESignupPlatform {
  GOOGLE = "GOOGLE",
  SLACK = "SLACK",
  META = "META",
  KAKAO = "KAKAO",
}

export type TRequestUser = Omit<User, "createdAt" | "updatedAt">;
type ValidCookieKey = "refresh_token";

declare module "express" {
  interface Request {
    user?: Nullable<TRequestUser>;
    cookies: { [key in ValidCookieKey]: string };
  }
}
