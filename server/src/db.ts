import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const connectToDB = async () => {
  mongoose.connect(MONGO_URI!);
  console.log("Connected to the Database");
};
