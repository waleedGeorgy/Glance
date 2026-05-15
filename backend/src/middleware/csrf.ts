import { type Request, type Response, type NextFunction } from "express";

export const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
  // Skip for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip for non-browser clients (mobile apps, Postman, etc.)
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // If it's a browser request, verify origin
  if (origin || referer) {
    const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

    const requestOrigin = origin || (referer ? new URL(referer).origin : null);

    if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
      return res.status(403).json({
        error: "CSRF check failed: Invalid origin",
      });
    }
  }

  // If no origin/referer (mobile apps), allow through
  next();
};
