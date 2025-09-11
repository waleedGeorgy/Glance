import bcrypt from "bcryptjs";
import { Notification } from "../models/notification.model.ts";
import { User } from "../models/user.model.ts";
import cloudinary from "../lib/cloudinary.ts";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username)
      return res
        .status(404)
        .json({ error: `No user with a username of ${username}` });

    const foundUser = await User.findOne({ username }).select("-password");
    if (!foundUser)
      return res.status(404).json({ error: "User does not exist" });

    return res.status(200).json(foundUser);
  } catch (error) {
    console.log("Error in getUserProfile", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followAndUnfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToModify = await User.findById(userId);
    const currentUser = await User.findById(req.user._id);

    if (req.user._id == userId)
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId },
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id },
      });

      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: userId },
      });

      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id },
      });

      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "follow",
      });

      await newNotification.save();

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followAndUnfollowUser", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const usersFollowedByCurrentUser = await User.findById(
      currentUserId
    ).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: currentUserId },
        },
      },
      { $sample: { size: 10 } },
      { $unset: ["password"] },
    ]);

    const usersNotFollowedByCurrentUser = users.filter(
      (user) => !usersFollowedByCurrentUser?.following.includes(user._id)
    );

    const suggestedUsers = usersNotFollowedByCurrentUser.slice(0, 4);

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const {
      firstName,
      lastName,
      username,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImage, coverImage } = req.body;

    let currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(404).json({ error: "User does not exist" });

    if ((!currentPassword && newPassword) || (!newPassword && currentPassword))
      return res
        .status(400)
        .json({ error: "Both the current and new password are required" });

    if (currentPassword && newPassword) {
      const isPasswordMatching = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );
      if (!isPasswordMatching)
        return res.status(400).json({ error: "Incorrect current password" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "New password must be at least 6 character long" });

      if (currentPassword === newPassword)
        return res
          .status(400)
          .json({ error: "You are already using this password" });

      currentUser.password = await bcrypt.hash(newPassword, 10);
    }

    if (profileImage) {
      if (currentUser.profileImage) {
        await cloudinary.uploader.destroy(
          currentUser.profileImage.split("/").pop()?.split(".")[0] as string
        );
      }
      const res = await cloudinary.uploader.upload(profileImage, {
        folder: "Glance",
      });
      profileImage = res.secure_url;
    }

    if (coverImage) {
      if (currentUser.coverImage) {
        await cloudinary.uploader.destroy(
          currentUser.coverImage.split("/").pop()?.split(".")[0] as string
        );
      }
      const res = await cloudinary.uploader.upload(coverImage, {
        folder: "Glance",
      });
      coverImage = res.secure_url;
    }

    currentUser.firstName = firstName || currentUser.firstName;
    currentUser.lastName = lastName || currentUser.lastName;
    currentUser.email = email || currentUser.email;
    currentUser.username = username || currentUser.username;
    currentUser.bio = bio || currentUser.bio;
    currentUser.link = link || currentUser.link;
    currentUser.profileImage = profileImage || currentUser.profileImage;
    currentUser.coverImage = coverImage || currentUser.coverImage;

    currentUser = await currentUser.save();

    return res.status(200).json(currentUser);
  } catch (error) {
    console.log("Error in updateUserProfile", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
