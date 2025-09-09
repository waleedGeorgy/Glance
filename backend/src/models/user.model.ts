import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImage: {
      type: String,
      required: false,
      default: ""
    },
    coverImage: {
        type: String,
        required: false,
        default: ""
    },
    bio: {
        type: String,
        required: false,
        default: ""
    },
    link: {
        type: String,
        required: false,
        default: ""
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
