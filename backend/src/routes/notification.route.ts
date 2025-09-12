import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.ts";
import {
  deleteNotification,
  deleteOneNotification,
  getAllNotifications,
} from "../controllers/notification.controller.ts";

const router = express.Router();

router.get("/", protectedRoute, getAllNotifications);
router.delete("/", protectedRoute, deleteNotification);
router.delete("/:id", protectedRoute, deleteOneNotification);

export default router;
