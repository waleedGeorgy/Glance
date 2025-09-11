import { Post } from "./../models/post.model.ts";
import cloudinary from "../lib/cloudinary.ts";
import { User } from "../models/user.model.ts";
import { Notification } from "../models/notification.model.ts";

export const createNewPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { image } = req.body;

    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(400).json({ error: "User does not exist" });

    if ((!text || text.trim().length === 0) && !image)
      return res.status(400).json({ error: "Cannot create an empty post" });

    if (image) {
      const res = cloudinary.uploader.upload(image, { folder: "Glance" });
      image = (await res).secure_url;
    }

    const newPost = await Post.create({
      byUser: currentUser._id,
      text,
      image,
    });

    await newPost.save();

    return res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const foundPost = await Post.findById(postId);
    if (!foundPost)
      return res.status(400).json({ error: "Post does not exist" });

    if (foundPost.byUser != req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You are not allowed to delete this post" });

    if (foundPost.image) {
      const imageId = foundPost.image.split("/").pop()?.split(".")[0] as string;
      await cloudinary.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user._id;
    const { text } = req.body;

    if (!text || text.trim().length == 0)
      return res.status(400).json({ error: "Text is required to comment" });

    const currentPost = await Post.findById(postId);
    if (!currentPost)
      return res.status(400).json({ error: "Post does not exist" });

    const newComment = { text, by: currentUserId };
    currentPost.comments.push(newComment);

    await currentPost.save();

    return res.status(200).json(currentPost);
  } catch (error) {
    console.log("Error in commentOnPost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeAndUnlikePost = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { postId } = req.params;

    const currentPost = await Post.findById(postId);
    if (!currentPost) return res.status(400).json({ error: "Post not found" });

    const hasUserLikedPost = currentPost.likes.includes(currentUserId);
    if (hasUserLikedPost) {
      await Post.updateOne(
        { _id: postId },
        { $pull: { likes: currentUserId } }
      );

      await User.updateOne(
        { _id: currentUserId },
        { $pull: { likedPosts: postId } }
      );

      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      currentPost.likes.push(currentUserId);

      await User.updateOne(
        { _id: currentUserId },
        { $push: { likedPosts: postId } }
      );

      await currentPost.save();

      const newNotification = Notification.create({
        from: currentUserId,
        to: currentPost.byUser,
        type: "like",
      });

      (await newNotification).save();
      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in likeAndUnlikePost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createAt: -1 })
      .populate({
        path: "byUser",
        select: "-password",
      })
      .populate({
        path: "comments.by",
        select: "-password",
      });

    if (posts.length == 0) return res.status(200).json([]);

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const currentUser = await User.findById(userId).select("-password");
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: currentUser.likedPosts } })
      .populate({
        path: "byUser",
        select: "-password",
      })
      .populate({
        path: "comments.by",
        select: "-password",
      });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(404).json({ error: "User does not exist" });

    const followingPosts = await Post.find({
      byUser: { $in: currentUser.following },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "byUser",
        select: "-password",
      })
      .populate({
        path: "comments.by",
        select: "-password",
      });

    return res.status(200).json(followingPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUser = await User.findOne({ username }).select("-password");
    if (!currentUser) res.status(404).json({ error: "User not found" });

    const userPosts = await Post.find({ byUser: currentUser?._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "byUser",
        select: "-password",
      })
      .populate({
        path: "comments.by",
        select: "-password",
      });

    return res.status(200).json(userPosts);
  } catch (error) {
    console.log("Error in getUserPosts", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
