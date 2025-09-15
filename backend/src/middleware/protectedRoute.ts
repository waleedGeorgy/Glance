import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.ts";
import { config } from "dotenv";
import { type NextFunction, type Response } from "express";

config();

export const protectedRoute = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ error: "Unauthorized: Token does not exist" });

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!decodedToken)
      return res.status(401).json({ error: "Unauthorized: Invalid token" });

    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Protected route error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
