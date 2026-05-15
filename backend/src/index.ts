import express, { type Response, type Request } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import path from "path";
import authRouter from "./routes/auth.route.ts";
import userRouter from "./routes/user.route.ts";
import postsRouter from "./routes/post.route.ts";
import notificationRouter from "./routes/notification.route.ts";
import { connectDb } from "./lib/mongodb.ts";
import { csrfCheck } from "./middleware/csrf.ts";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT!;
const __dirname = path.resolve();

const app = express();

const limiter = rateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    error: "Too many requests. Please try again later.",
  },
});

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfCheck);
app.use(limiter);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/notifications", notificationRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  connectDb();
});
