import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.ts";
import {
  deleteNotifications,
  deleteOneNotification,
  getAllNotifications,
} from "../controllers/notification.controller.ts";

const router = express.Router();

router.get("/", protectedRoute, getAllNotifications);
router.delete("/", protectedRoute, deleteNotifications);
router.delete("/:id", protectedRoute, deleteOneNotification);

export default router;
