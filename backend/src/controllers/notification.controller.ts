import { type Response } from "express";
import { Notification } from "../models/notification.model.ts";
import { type ExpandedRequestWithAuthUser } from "../middleware/protectedRoute.ts";

export const getAllNotifications = async (
  req: ExpandedRequestWithAuthUser,
  res: Response,
) => {
  try {
    const currentUserId = req.user?._id.toString();

    const notifications = await Notification.find({
      to: currentUserId,
    }).populate({
      path: "from",
      select: "_id firstName lastName username profileImage",
    });

    await Notification.updateMany({ to: currentUserId }, { read: true });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getAllNotifications", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (
  req: ExpandedRequestWithAuthUser,
  res: Response,
) => {
  try {
    const currentUserId = req.user?._id.toString();

    await Notification.deleteMany({ to: currentUserId });

    return res
      .status(200)
      .json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOneNotification = async (
  req: ExpandedRequestWithAuthUser<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id.toString();

    const notification = await Notification.findById(id);
    if (!notification)
      return res.status(404).json({ error: "Notification does not exist" });

    if (notification.to.toString() !== currentUserId)
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this notification" });

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({ error: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteOneNotification", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
