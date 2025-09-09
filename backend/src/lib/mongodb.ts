import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Successfully connected to:", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
