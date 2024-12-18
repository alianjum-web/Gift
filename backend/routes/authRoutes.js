import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pino from "pino";
import rateLimit from "express-rate-limit";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../models/userValidatorSchema.js";
import validate from "../middleware/validationMiddleware.js";
import { User } from "../models/userModel.js";
import authenticationToken from "../middleware/authMiddleware.js";

const router = express.Router();
dotenv.config();

const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});

// mongoose level code
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { username, firstName, lastName, age, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      age,
      email,
      password,
    });

    await newUser.save();
    console.log("New user created:", newUser);

    const payload = {
      user: {
        id: newUser._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated JWT token:", authToken);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Unable to register user" });
  }
});
// validate(registerSchema),
//mongoDB direct integration code
// router.post("/register", validate(registerSchema), async (req, res) => {
//   try {
//     const db = await connectDB();
//     const collection = db.collection("users");
//     const existingUser = await collection.findOne({ email: req.body.email });

//     if (existingUser) {
//       logger.error("Email id already exist");
//       return res
//         .status(400)
//         .json({ message: "User with this email already exist" });
//     }

//     const { password } = req.body;
//     const hash = await bcrypt.hash(password, 10);

//     const newUser = await collection.insertOne({
//       name: req.body.name,
//       email: req.body.email,
//       password: hash,
//       createdAt: new Date(),
//     });

//     await newUser.save();
//     const payload = {
//       user: {
//         id: newUser.insertedId,
//       },
//     };

//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

//     // Send token via HttpOnly cookie
//     res.cookie("authToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
//       sameSite: "None",
//     });

//     return res.status(200).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Unable to register user");
//   }
// });

router.post(
  "/login",
  validate(loginSchema),
  loginRateLimiter,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        logger.error("User not found");
        return res.status(403).json({ message: "Invalid login credentials" });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordMatches) {
        logger.error("Incorrect password");
        return res.status(403).json({ message: "Invalid login credentials" });
      }

      const payload = {
        user: {
          id: existingUser._id.toString(),
          tokenVersion: existingUser.tokenVersion,
        },
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      // Send token via HttpOnly cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 3600 * 1000, // 1 hour (or adjust as needed)
      });      

      logger.info("User logged in successfully");
      return res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
      logger.error(error.message);
      return res
        .status(500)
        .json({ message: "Internal server error", detail: error.message });
    }
  }
);

// Middleware to verify the token from cookies
router.get("/me",authenticationToken, async (req, res) => {
  // const token = req.cookies.authToken;
  // // const token = req.headers('Authorization').split('')[1];
  // if (!token) {
  //   logger.error("No token found in cookies.");
  //   return res.status(403).json({ message: "Authentication token missing" });
  // }

  // const JWT_SECRET = process.env.JWT_SECRET;
  // try {
  //   jwt.verify(token, JWT_SECRET, async (err, decoded) => {
  //     if (err) {
  //       logger.error("Invalid token", err);
  //       return res.status(401).json({ message: "Invalid token" });
  //     }

  //     const user = await User.findOne({ _id: decoded.user.id });
  //     if (!user || user.tokenVersion !== decoded.user.tokenVersion) {
  //       logger.error(
  //         "Token is invalid or expired due to mismatched tokenVersion."
  //       );
  //       return res.status(401).json({ message: "Token is invalid or expired" });
  //     }

  //     logger.info(`User authenticated: ${user.email}`);
  //     req.user = {
  //       id: user._id,
  //       email: user.email,
  //       tokenVersion: user.tokenVersion,
  //     };

  //     return res.status(200).json({ message: "user have the token" });
  //   });
  // } catch (error) {
  //   logger.error("Token verification failed ", error);
  //   return res.status(401).json({ message: "Invalid authenticated token" });
  // }
  return res.status(200).json({message: "User is authenticated"})
});

//MongoDB direct code
// router.post("/login", validate(loginSchema), async (req, res) => {
//   try {
//     const db = await connectDB();
//     const collection = await db.collection("users");
//     const existedUser = await collection.findOne({ email: req.body.email });

//     if (existedUser) {
//       const result = await bcrypt.compare(
//         req.body.password,
//         existedUser.password
//       );
//       if (!result) {
//         logger.error("Password does not match");
//         return res.status(404).json({ message: "Invalid login credentials" });
//       }
//       const payload = {
//         user: {
//           id: existedUser._id.toString(),
//         },
//       };
//       const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
//       // Send token via HttpOnly cookie
//       res.cookie("authToken", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
//         sameSite: "None",
//       });
//       logger.info("User logged in successfully");
//       return res.status(200).json({ message: "User logged in successfully" });
//     } else {
//       logger.error("User not found");
//       return res.status(403).json({ message: "User not found" });
//     }
//   } catch (e) {
//     logger.error(e);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", detail: e.message });
//   }
// });

router.put(
  "/update",
  authenticationToken,
  validate(updateUserSchema),
  async (req, res) => {
    try {
      const emailFromAuth = req.user.email; // Email from authentication middleware
      logger.info(`Email from authentication: ${emailFromAuth}`); // Log the email

      if (!emailFromAuth) {
        logger.error("Email is not present in authentication data");
        return res
          .status(400)
          .json({ message: "Email is missing in authentication data" });
      }

      const existingUser = await User.findOne({ email: emailFromAuth });
      if (!existingUser) {
        logger.error("User does not exist in the database");
        return res.status(404).json({ message: "User not found" });
      }

      const updatedFields = {};
      if (req.body.username) updatedFields.username = req.body.username;
      if (req.body.email) updatedFields.email = req.body.email;

      let isPasswordChanged = false;
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        updatedFields.password = hash;
        updatedFields.tokenVersion = existingUser.tokenVersion + 1;
        isPasswordChanged = true;
      }

      updatedFields.updatedAt = new Date();

      const updatedUser = await User.findOneAndUpdate(
        { email: emailFromAuth },
        { $set: updatedFields },
        { new: true } // Return the updated document
      );

      if (isPasswordChanged) {
        const payload = {
          user: {
            id: updatedUser._id.toString(),
            tokenVersion: updatedUser.tokenVersion,
          },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
        });
      }

      logger.info("User updated successfully");
      return res
        .status(200)
        .json(
          { message: "User updated successfully", user: updatedUser },
          token
        );
    } catch (error) {
      logger.error("Error in update API", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// router.put("/update", validate(updateUserSchema), async (req, res) => {
//   try {

//     const emailFromHeader = req.headers.email;
//     if (!emailFromHeader) {
//       logger.error("Email is not present");
//       return res
//         .status(400)
//         .json({ message: "Email is not present in the request header" });
//     }

//     const db = await connectDB();
//     const collection = db.collection("users");

//     const existedUser = await collection.findOne({ email: emailFromHeader });
//     if (existedUser) {
//       const updatedFields = {};
//       if (req.body.name) updatedFields.firstName = req.body.name;
//       if (req.body.email) updatedFields.email = req.body.email;
//       if (req.body.password) {
//         const hash = await bcrypt.hash(password, 10);
//         updatedFields.password = hash;
//       }
//       updatedFields.updateAt = new Date();

//       const updatedUser = await collection.findOneAndUpdate(
//         { email: emailFromHeader },
//         { $set: updatedFields },
//         { returnDocument: "after" } // Correct option for MongoDB driver v4+
//       );

//       const payload = {
//         user: {
//           id: updatedUser.value._id.toString(),
//         },
//       };

//       const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
//       res.cookie("authToken", token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//       });

//       logger.info("user updated successfully");
//       return res.status(200).json({ message: "user updated successfully" });
//     } else {
//       logger.error("user does not exit in the database");
//       return res.status(401).json({ message: "user does not already exited" });
//     }
//   } catch (error) {
//     logger.error("Error in update API");
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

router.delete("/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  return res.status(200).json({ message: "Logout Successful" });
});

export default router;

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
