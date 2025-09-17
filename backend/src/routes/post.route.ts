import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.ts";
import {
  commentOnPost,
  createNewPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeAndUnlikePost,
} from "../controllers/post.controller.ts";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/liked/:id", protectedRoute, getLikedPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.post("/create", protectedRoute, createNewPost);
router.post("/like/:postId", protectedRoute, likeAndUnlikePost);
router.post("/comment/:postId", protectedRoute, commentOnPost);
router.delete("/:postId", protectedRoute, deletePost);
router.delete("/:postId/:commentId", protectedRoute, deleteComment);

export default router;
