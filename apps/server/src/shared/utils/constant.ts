import type { CookieOptions } from "express";

export const COOKIE_KEY_REFRESH_TOKEN = "refresh_token";

export const COOKIE_POLICY_REFRESH_TOKEN = (
  process.env.NODE_ENV === "development"
    ? {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        domain: "localhost",
        maxAge: 1000 * 60 * 60 * 24 * 8, // 8d
      }
    : {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        domain: ".zuhno.io",
        maxAge: 1000 * 60 * 60 * 24 * 8, // 8d
      }
) as CookieOptions;
