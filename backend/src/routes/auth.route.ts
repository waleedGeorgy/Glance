import express from "express";
import {
  login,
  logout,
  signup,
  getCurrentAuthUser,
} from "../controllers/auth.controller.ts";
import { protectedRoute } from "../middleware/protectedRoute.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getCurrentAuthUser", protectedRoute, getCurrentAuthUser);

export default router;
