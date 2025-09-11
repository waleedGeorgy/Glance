import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.ts";
import { protectedRoute } from "../middleware/protectedRoute.ts";

const router = express.Router();

router.get("/checkAuth", protectedRoute, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
