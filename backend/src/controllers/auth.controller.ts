import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import { User } from "../models/user.model.ts";
import { generateToken } from "../lib/generateToken.ts";
import { type ExpandedRequestWithAuthUser } from "../middleware/protectedRoute.ts";

type AuthBodyType = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};

export const signup = async (
  req: Request<{}, {}, AuthBodyType>,
  res: Response,
) => {
  try {
    const { username, firstName, lastName, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email" });
    }
    if (!username || username.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide a unique username" });
    }
    if (!firstName || firstName.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a first name" });
    }
    if (!lastName || lastName.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a last name" });
    }
    if (!password || password.trim().length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ error: "Username already in use" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);

      await newUser.save();

      return res.status(201).json(newUser);
    } else {
      return res.status(400).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.log("Error in signup controller" + error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (
  req: Request<{}, {}, Pick<AuthBodyType, "username" | "password">>,
  res: Response,
) => {
  try {
    const { username, password } = req.body;
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: "Please enter your username" });
    }
    if (!password || password.trim().length === 0) {
      return res.status(400).json({ error: "Please enter your password" });
    }

    const user = await User.findOne({ username });

    const isPasswordMatching = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!isPasswordMatching || user?.username !== username) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateToken(user?._id.toString()!, res);

    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in login controller" + error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller" + error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurrentAuthUser = async (
  req: ExpandedRequestWithAuthUser,
  res: Response,
) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in getCurrentAuthUser controller" + error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
