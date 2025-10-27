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
        domain: ".zuhno.org",
        maxAge: 1000 * 60 * 60 * 24 * 8, // 8d
      }
) as CookieOptions;

export const COOKIE_KEY_VISITOR_ID = "visitor_id";

export const COOKIE_POLICY_VISITOR_ID = (
  process.env.NODE_ENV === "development"
    ? {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        domain: "localhost",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
      }
    : {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        domain: ".zuhno.org",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
      }
) as CookieOptions;
