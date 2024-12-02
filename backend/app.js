import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pinoHttp from "pino-http";
import logger from "./logger.js";

//import routes
import authRoutes from "./routes/authRoutes.js";
import giftRoutes from "./routes/giftRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import connectDB from "./models/db.js";

const app = express();
const PORT = 3060;

app.use(express.json());
app.use(cookieParser());
app.use("*", cors());
app.use(express.urlencoded({ extended: true }));


app.use(pinoHttp({ logger }));

connectDB();

app.use("/api/gift", giftRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.log(err); // can use return below but not neccessary as middleware stop because not used next();
  res.status(500).json({ message: "Internal server error" });
});

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(PORT, () => {
  console.log(`Server is runnig at the port http://localhost:${PORT}`);
});
