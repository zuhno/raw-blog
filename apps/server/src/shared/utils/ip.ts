import { type Request } from "express";

export const getClientIpFromHeaders = (req: Request) => {
  const xff = req.headers["x-forwarded-for"];
  if (Array.isArray(xff)) return xff[0];
  if (typeof xff === "string") {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return (req.headers["x-real-ip"] as string) || req.ip; // req.ip는 trust proxy 영향을 받음
};
