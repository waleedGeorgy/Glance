import express from "express";
import {
  followAndUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.ts";
import { protectedRoute } from "../middleware/protectedRoute.ts";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.post("/update", protectedRoute, updateUserProfile);
router.post("/follow/:userId", protectedRoute, followAndUnfollowUser);
router.get("/suggested", protectedRoute, getSuggestedUsers);

export default router;
