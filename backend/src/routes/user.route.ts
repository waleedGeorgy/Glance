import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.ts";
import {
  followAndUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.ts";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.post("/follow/:userId", protectedRoute, followAndUnfollowUser);
router.post("/update", protectedRoute, updateUserProfile);

export default router;
