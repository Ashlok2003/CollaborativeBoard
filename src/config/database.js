import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Database connected");
  } catch (error) {
    console.log("Database connection error", error);
  }
}

export default connectDB;
