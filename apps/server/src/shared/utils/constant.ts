import type { CookieOptions } from "express";

export const COOKIE_KEY_REFRESH_TOKEN = "refresh_token";

export const COOKIE_POLICY_REFRESH_TOKEN = (
  process.env.NODE_ENV === "development"
    ? {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: true,
        domain: "localhost",
        maxAge: 60 * 60 * 24 * 8, // 8d
      }
    : {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        domain: ".zuhno.io",
        maxAge: 60 * 60 * 24 * 8, // 8d
      }
) as CookieOptions;
