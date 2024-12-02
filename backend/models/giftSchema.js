import mongoose, {Schema} from "mongoose";

const giftSchema = new Schema({
    id: {
      type: String,
      unique: true,
      required: ["required to insert data", true]
    },  
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
 

export const Gift = mongoose.model('Gift', giftSchema);