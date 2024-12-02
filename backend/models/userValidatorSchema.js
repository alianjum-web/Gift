import Joi from "joi";

// Joi Schema for User Registration
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "First Name is required",
    "string.min": "First Name must be at least 2 characters",
    "string.max": "First Name cannot exceed 30 characters",
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Last Name is required",
    "string.min": "Last Name must be at least 2 characters",
    "string.max": "Last Name cannot exceed 30 characters",
  }),
  // age: Joi.number().integer().min(0).required().messages({
  //   "number.base": "Age must be a number",
  //   "number.min": "Age must be a positive number",
  //   "number.empty": "Age is required",
  // }),
  // username: Joi.string().min(3).max(20).required().messages({
  //   "string.empty": "Username is required",
  //   "string.min": "Username must be at least 3 characters",
  //   "string.max": "Username cannot exceed 20 characters",
  // }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must include uppercase, number, and special character",
    }),
});


// Joi Schema for User Login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional() ,
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});


export { registerSchema, loginSchema, updateUserSchema };
