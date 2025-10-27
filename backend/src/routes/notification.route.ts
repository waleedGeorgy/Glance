import express from "express";
import {
  deleteNotifications,
  deleteOneNotification,
  getAllNotifications,
} from "../controllers/notification.controller.ts";
import { protectedRoute } from "../middleware/protectedRoute.ts";

const router = express.Router();

router.get("/", protectedRoute, getAllNotifications);
router.delete("/", protectedRoute, deleteNotifications);
router.delete("/:id", protectedRoute, deleteOneNotification);

export default router;
