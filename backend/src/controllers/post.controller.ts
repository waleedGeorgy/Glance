import { type Request, type Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/user.model.ts";
import { Post } from "./../models/post.model.ts";
import { Notification } from "../models/notification.model.ts";
import cloudinary from "../lib/cloudinary.ts";
import { type ExpandedRequestWithAuthUser } from "../middleware/protectedRoute.ts";

type PostBodyType = {
  text: string;
  image: string | null;
};

export const createNewPost = async (
  req: ExpandedRequestWithAuthUser<{}, {}, PostBodyType>,
  res: Response,
) => {
  try {
    const { text } = req.body;
    let { image } = req.body;

    const currentUserId = req.user?._id!.toString();
    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(400).json({ error: "User does not exist" });

    if ((!text || text.trim().length === 0) && !image)
      return res.status(400).json({ error: "Cannot create an empty post" });

    if (image) {
      const res = await cloudinary.uploader.upload(image, { folder: "Glance" });
      image = res.secure_url;
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

export const deletePost = async (
  req: ExpandedRequestWithAuthUser<{ postId: string }>,
  res: Response,
) => {
  try {
    const { postId } = req.params;

    const foundPost = await Post.findById(postId);
    if (!foundPost)
      return res.status(400).json({ error: "Post does not exist" });

    if (foundPost.byUser.toString() !== req.user?._id.toString())
      return res
        .status(400)
        .json({ error: "You can only delete your own posts" });

    if (foundPost.image) {
      const imageId = foundPost.image.split("/").pop()?.split(".")[0];
      const imageToDelete = `Glance/${imageId}`;
      await cloudinary.uploader.destroy(imageToDelete);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (
  req: ExpandedRequestWithAuthUser<{ postId: string; commentId: string }>,
  res: Response,
) => {
  try {
    const { postId, commentId } = req.params;
    const currentUserId = req.user?._id.toString();

    const currentPost = await Post.findById(postId);
    if (!currentPost) {
      return res.status(404).json({ error: "Post does not exist" });
    }

    const comment = currentPost.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment does not exist" });
    }

    const isCommentAuthor = comment.by.toString() === currentUserId;
    const isPostOwner = currentPost.byUser.toString() === currentUserId;

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({
        error: "You are not authorized to delete this comment",
      });
    }

    currentPost.comments.pull(commentId);
    await currentPost.save();

    const populatedPost = await Post.findById(postId).populate({
      path: "comments.by",
      select: "_id firstName lastName username profileImage",
    });

    return res.status(200).json(populatedPost?.comments);
  } catch (error) {
    console.log("Error in deleteComment", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (
  req: ExpandedRequestWithAuthUser<
    { postId: string },
    {},
    Pick<PostBodyType, "text">
  >,
  res: Response,
) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user?._id!.toString();
    const { text } = req.body;

    if (!text || text.trim().length === 0)
      return res.status(400).json({ error: "Text is required to comment" });

    const currentPost = await Post.findById(postId);
    if (!currentPost)
      return res.status(400).json({ error: "Post does not exist" });

    const newComment = { text, by: currentUserId };
    currentPost.comments.push(newComment);

    await currentPost.save();

    const populatedPost = await Post.findById(postId).populate({
      path: "comments.by",
      select: "_id firstName lastName username profileImage",
    });

    const newNotification = await Notification.create({
      from: currentUserId,
      to: currentPost.byUser,
      type: "comment",
    });

    await newNotification.save();

    return res.status(200).json(populatedPost?.comments);
  } catch (error) {
    console.log("Error in commentOnPost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeAndUnlikePost = async (
  req: ExpandedRequestWithAuthUser<{ postId: string }>,
  res: Response,
) => {
  try {
    const currentUserId = req.user?._id.toString();
    const { postId } = req.params;

    const currentPost = await Post.findById(postId);
    if (!currentPost) return res.status(400).json({ error: "Post not found" });

    const hasUserLikedPost = currentPost.likes.includes(
      new Types.ObjectId(currentUserId),
    );
    if (hasUserLikedPost) {
      await Post.updateOne(
        { _id: postId },
        { $pull: { likes: currentUserId } },
      );

      await User.updateOne(
        { _id: currentUserId },
        { $pull: { likedPosts: postId } },
      );

      const updatedLikes = currentPost.likes.filter(
        (id) => id.toString() !== currentUserId?.toString(),
      );

      return res.status(200).json(updatedLikes);
    } else {
      currentPost.likes.push(new Types.ObjectId(currentUserId));

      await User.updateOne(
        { _id: currentUserId },
        { $push: { likedPosts: postId } },
      );

      await currentPost.save();

      if (currentUserId?.toString() !== currentPost.byUser._id.toString()) {
        const newNotification = await Notification.create({
          from: currentUserId,
          to: currentPost.byUser,
          type: "like",
        });

        await newNotification.save();
      }

      const updatedLikes = currentPost.likes;
      return res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeAndUnlikePost", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .populate({
        path: "byUser",
        select: "-password",
      })
      .populate({
        path: "comments.by",
        select: "-password",
      });

    if (posts.length === 0) return res.status(200).json([]);

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req: Request, res: Response) => {
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

export const getFollowingPosts = async (
  req: ExpandedRequestWithAuthUser,
  res: Response,
) => {
  try {
    const currentUserId = req.user?._id.toString();

    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(404).json({ error: "User does not exist" });

    const followingPosts = await Post.find({
      byUser: { $in: currentUser.following },
    })
      .sort({ _id: -1 })
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

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const currentUser = await User.findOne({ username }).select("-password");
    if (!currentUser) res.status(404).json({ error: "User not found" });

    const userPosts = await Post.find({ byUser: currentUser?._id })
      .sort({
        _id: -1,
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
