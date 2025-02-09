import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URL);

    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
