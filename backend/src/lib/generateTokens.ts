import jwt from "jsonwebtoken";
import type { Response } from "express";

interface TokenPayload {
  userId: string | number;
}

interface CookieSettings {
  maxAge: number;
  httpOnly: boolean;
  sameSite: "strict" | "lax" | "none";
  secure: boolean;
}

export const generateTokenSetCookie = (
  userId: string | number,
  res: Response
): string => {
  const token = jwt.sign(
    { userId } as TokenPayload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "14d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  } as CookieSettings);

  return token;
};
