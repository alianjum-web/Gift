import dotenv from "dotenv";
import mongoose from "mongoose";
import { Gift } from "./giftSchema.js";

dotenv.config({path: '../.env'});

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
    const gifts = await Gift.find({});
    console.log(`Connected to MongoDB successfully at ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
