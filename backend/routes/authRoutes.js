import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connectDB from "../models/db.js";
import dotenv from "dotenv";
import pino from "pino";
import { registerSchema, loginSchema } from "../models/userValidatorSchema.js";
import validate from '../middleware/validationMiddleware.js';

const router = express.Router();
dotenv.config();

const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      logger.error("Email id already exist");
      return res
        .status(400)
        .json({ message: "User with this email already exist" });
    }

    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await collection.insertOne({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      createdAt: new Date(),
    });

    await newUser.save();
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Send token via HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // Set to true in production with HTTPS
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Unable to register user");
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const db = await connectDB();
    const collection = await db.collection("users");
    const existedUser = await collection.findOne({ email: req.body.email });
    
    if (existedUser) {
      const result = await bcrypt.compare(req.body.password, existedUser.password);
      if (!result) {
        logger.error("Password does not match");
        return res.status(404).json({ message: "Invalid login credentials" });
      }
      const payload = {
        user: {
          id: existedUser._id.toString(),
        }
      }
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
     // Send token via HttpOnly cookie
     res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // Set to true in production with HTTPS
      sameSite: "Strict",
    });
    logger.info("User logged in successfully")
    return res.status(200).json({ message: 'User logged in successfully' });
    } else {
      logger.error("User not found");
      return res.status(403).json({message: "User not found" });
    }
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ message: "Internal server error", detail: error.message })
  }

});

router.put("/update", (req, res) => {});

router.delete("/logout", (req, res) => {});


/*

### What is `express-validator`?

`express-validator` is a library for validating and sanitizing user inputs in **Express.js** applications. It integrates seamlessly with Express middleware to help ensure data integrity, avoid invalid inputs, and reduce potential security vulnerabilities like injection attacks.

---

### Use Cases of `express-validator`

#### 1. **Input Validation**
   - Validate data from forms, APIs, or query parameters.
   - Examples:
     - Check if an email is valid: `isEmail()`.
     - Ensure a password meets security standards: `isStrongPassword()` or custom regex rules.
     - Validate numeric inputs: `isInt()`, `isFloat()`.

#### 2. **Sanitization**
   - Remove malicious or unnecessary content from user inputs.
   - Examples:
     - Trim leading/trailing spaces: `trim()`.
     - Escape special characters to prevent HTML/SQL injection: `escape()`.
     - Normalize emails: `normalizeEmail()`.

#### 3. **Improved Code Readability**
   - Simplifies validation logic with a declarative, chainable API.
   - Example:
     ```javascript
     check('email').isEmail().withMessage('Invalid email format'),
     ```

#### 4. **Custom Validators**
   - Implement application-specific validation logic.
   - Example:
     ```javascript
     check('username').custom(value => {
         if (value.includes('admin')) {
             throw new Error('Username cannot include "admin"');
         }
         return true;
     });
     ```

#### 5. **Error Handling**
   - Provides a consistent mechanism to handle validation errors.
   - Example:
     ```javascript
     const { validationResult } = require('express-validator');
     app.post('/user', [
         check('email').isEmail(),
         check('password').isLength({ min: 5 })
     ], (req, res) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });
         }
         res.send('Success');
     });
     ```

#### 6. **Scalable and Reusable Rules**
   - Define reusable validation chains to keep your code DRY.
   - Example:
     ```javascript
     const userValidationRules = [
         check('email').isEmail(),
         check('password').isLength({ min: 8 })
     ];
     app.post('/register', userValidationRules, handlerFunction);
     ```

#### 7. **Reducing Security Risks**
   - Helps mitigate risks like SQL injection and cross-site scripting (XSS) by sanitizing inputs.

---

### Pros of Using `express-validator`

1. **Simple and Intuitive**: Easy to set up and use, even for complex validation scenarios.
2. **Rich Validation Set**: Comes with a wide range of built-in validation and sanitization methods.
3. **Customizable**: Supports custom validators for specific use cases.
4. **Middleware Integration**: Works seamlessly with Express middleware, fitting naturally into the request-response lifecycle.
5. **Error Management**: Provides robust error reporting, helping to pinpoint invalid inputs easily.

---

### Cons of Using `express-validator`

1. **Dependency Overhead**: Adds an extra dependency to your project, which could increase package size.
2. **Performance**: For high-traffic applications, heavy validation logic may impact performance slightly (though negligible in most cases).
3. **Learning Curve for Advanced Usage**: While basic usage is straightforward, customizing and combining validators can be more complex.
4. **Limited Use Outside Express**: Tightly coupled to Express, making it less useful if you're using a different framework.

---

### When Should You Use `express-validator`?

#### Use It When:
- You are building an Express.js application.
- Input validation and sanitization are essential (e.g., user registration, form submissions, API requests).
- You need to quickly implement robust validation logic without writing it from scratch.
- Security is a priority, and you want to avoid common vulnerabilities.

#### Consider Alternatives If:
- You are not using Express.js.
- You prefer validation libraries/frameworks independent of Express (e.g., `Joi`, `Yup`).
- You need a highly optimized, lightweight validation solution for non-Express projects.

---

### Conclusion

`express-validator` is an excellent choice for validation and sanitization in Express.js applications. It provides a structured, secure, and extensible way to handle user input. However, evaluate the project's requirements and constraints before deciding, as alternatives like `Joi` or `Yup` might better suit certain use cases.

*/