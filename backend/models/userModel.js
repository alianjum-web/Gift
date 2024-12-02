import mongoose, { Schema }from 'mongoose';
import bcrypt from 'bcrypt';
// import validate from '../middleware/validationMiddleware';
// import { types } from 'joi';

const userSchema =  new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Email must be valid"], // Enforces a basic email format
      lowercase: true, // Automatically converts email to lowercase
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Regex for at least one uppercase letter, one number, and one special character
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message: "Password must include at least one uppercase letter, one number, and one special character",
      },
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Fix: use 'password' instead of 'Password'

    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  

export const User = mongoose.model('User', userSchema);