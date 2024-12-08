import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import logger from "../logger.js";

const authenticationToken = async (req, res, next) => {
  const token = req.cookies.authToken;
  // const token = req.headers('Authorization').split('')[1];
  if (!token) {
    logger.error("No token found in cookies.");
    return res.status(403).json({ message: "Authentication token missing" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        logger.error("Invalid token", err);
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await User.findOne({ _id: decoded.user.id });
      if (!user || user.tokenVersion !== decoded.user.tokenVersion) {
        logger.error(
          "Token is invalid or expired due to mismatched tokenVersion."
        );
        return res.status(401).json({ message: "Token is invalid or expired" });
      }

      logger.info(`User authenticated: ${user.email}`);
      req.user = { id: user._id, email: user.email, tokenVersion: user.tokenVersion };
      next();
    });
} catch (error) {
    logger.error("Token verification failed ", error);
    return res.status(401).json({ message: "Invalid authenticated token" });
  }
};

export default authenticationToken;

// import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";
// import logger from "../logger.js";

// const authenticationToken = async (req, res, next) => {
//   const token = req.cookies.authToken;

//   if (!token) {
//     logger.error("No token found in cookies.");
//     return res.status(403).json({ message: "Authentication token missing" });
//   }

//   const JWT_SECRET = process.env.JWT_SECRET;

//   try {
    //     const decoded = jwt.verify(token, JWT_SECRET); // Synchronously decode the token
    //     const user = await User.findOne({ _id: decoded.user.id });
// console.log(user);
//     if (!user || user.tokenVersion !== decoded.user.tokenVersion) {
    //       logger.error("Token is invalid or expired due to mismatched tokenVersion.");
    //       return res.status(401).json({ message: "Token is invalid or expired" });
//     }

//     logger.info(`User authenticated: ${user.email}`);
//     req.user = { id: user._id.toString(), email: user.email, tokenVersion: user.tokenVersion }; // Add user details to req
//     next();
//   } catch (error) {
//     logger.error("Token verification failed", error);
//     return res.status(401).json({ message: "Invalid authentication token" });
//   }
// };

// export default authenticationToken;

    
        /*
    
            const decoded = jwt.verify(token, JWT_SECRET);
            // console.log(decoded);
            // Output: { user: { id: "64a6b5e4d4c4e123456789ab", tokenVersion: 2 }, iat: 1733113779, exp: 1733117379 }
    
            // Fetch user details from database
            const user = await User.findById(decoded.user.id).lean();
            // console.log(user);
    // Output: { _id: "64a6b5e4d4c4e123456789ab", username: "testuser", email: "testuser@example.com", ... }
            if (!user || user.tokenVersion !== decoded.user.tokenVersion) {
                logger.error("Invalid or expired token.");
                return res.status(401).json({ message: "Invalid or expired token" });
            }
    
            req.user = { id: user._id, email: user.email, tokenVersion: user.tokenVersion };
            logger.info(`User authenticated: ${req.user.email}`);
            next();
    
        */