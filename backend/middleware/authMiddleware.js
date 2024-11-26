import dotenv from 'dotenv';
import jwt, { decode } from 'jsonwebtoken';

const authenticationToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if(!token) return res.status(404).json({ message: "User does not have the token to authenticate" });
    const JWT_SECRET = process.env.JWT_SECRET;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" })
        }
        req.user = decoded.user;
        next();
    })
}
export default authenticationToken;