import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_URL;

async function connectDB() {
  try {
    if (!uri) {
      console.error("Error: MONGO_URL is not defined in environment variables.");
      process.exit(1);
    }

    const connectionInstance = await mongoose.connect(uri, {
      dbName: "giftdb"
    });

    console.log(`Connected to MongoDB successfully at ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;
