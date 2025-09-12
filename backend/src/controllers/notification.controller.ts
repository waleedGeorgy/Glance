import { Notification } from "../models/notification.model.ts";

export const getAllNotifications = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const notification = await Notification.find({
      to: currentUserId,
    }).populate({
      path: "from",
      select: "username, profileImage",
    });

    await Notification.updateMany({ to: currentUserId }, { read: true });

    return res.status(200).json(notification);
  } catch (error) {
    console.log("Error in getAllNotifications", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    await Notification.deleteMany({ to: currentUserId });

    return res
      .status(200)
      .json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOneNotification = async (req, res) => {
  try {
    const notificationId = req.params;
    const currentUserId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification)
      return res.status(404).json({ error: "Notification does not exist" });

    if (notification.to != currentUserId)
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this notification" });

    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({ error: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteOneNotification", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
