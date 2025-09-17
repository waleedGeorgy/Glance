import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.route.ts";
import userRouter from "./routes/user.route.ts";
import postsRouter from "./routes/post.route.ts";
import notificationRouter from "./routes/notification.route.ts";
import { connectDb } from "./lib/mongodb.ts";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

const __dirname = path.resolve();

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/notifications", notificationRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
  connectDb();
});
