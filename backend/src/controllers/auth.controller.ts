import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts";
import { generateTokenSetCookie } from "../lib/generateTokens.ts";

export const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (!firstName || firstName.trim().length === 0) {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!lastName || lastName.trim().length === 0) {
      return res.status(400).json({ error: "Last name is required" });
    }
    if (!password || password.trim().length < 6) {
      return res
        .status(400)
        .json({ error: "At least 6 characters are required" });
    }
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ error: "Username already in use" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenSetCookie(newUser._id, res);

      await newUser.save();

      return res.status(201).json(newUser);
    } else {
      return res.status(400).json({ error: "Failed to create the user" });
    }
  } catch (error) {
    console.log("Error in signup controller" + error);
    return res(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a valid username" });
    }
    if (!password || password.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a valid password" });
    }

    const user = await User.findOne({ username });

    const isPasswordMatching = await bcrypt.compare(
      password,
      (user?.password as string) || ""
    );

    if (!isPasswordMatching || user?.username !== username) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    generateTokenSetCookie(user?._id, res);
    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in login controller" + error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller" + error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in checkAuth controller" + error);
    return res(500).json({ error: "Internal server error" });
  }
};
