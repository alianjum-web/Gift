import mongoose from "mongoose";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import connectDB from "../../models/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filename = `${__dirname}/gifts.json`;

const giftSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  condition: String,
  posted_by: String,
  zipcode: String,
  date_added: Number,
  age_days: Number,
  age_years: Number,
  description: String,
  image: String,
});

const Gift = mongoose.model("Gift", giftSchema);

async function insertData() {
  try {
    await connectDB();

    const data = JSON.parse(fs.readFileSync(filename, "utf-8")).docs;
    const count = await Gift.countDocuments();

    if (count === 0) {
      const result = await Gift.insertMany(data);
      console.log(`${result.length} documents inserted successfully.`);
    } else {
      console.log("Documents already exist in the database.");
    }
  } catch (error) {
    console.error("Error while inserting data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

insertData();
