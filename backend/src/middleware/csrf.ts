import { config } from "dotenv";
import { type Request, type Response, type NextFunction } from "express";

config();

export const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (origin || referer) {
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);

    const allowedOrigins =
      process.env.NODE_ENV === "development"
        ? ["http://localhost:5173"]
        : [
            process.env.CLIENT_URL,
            `https://${req.headers.host}`,
            `http://${req.headers.host}`,
          ].filter(Boolean);

    if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
      return res.status(403).json({
        error: "CSRF check failed: Invalid origin",
      });
    }
  }

  next();
};
