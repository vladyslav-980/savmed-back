import mongoose from "mongoose";

export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  await mongoose.connect(mongoUri);

  console.log("MongoDB connection successful");
};