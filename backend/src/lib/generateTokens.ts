import jwt from "jsonwebtoken";

export const generateTokenSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "14d",
  });

  res.cookie("jwt", token, {
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
