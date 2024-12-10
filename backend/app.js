import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from 'helmet';
import pinoHttp from "pino-http";
import logger from "./logger.js";

//import routes
import authRoutes from "./routes/authRoutes.js";
import giftRoutes from "./routes/giftRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import connectDB from "./models/db.js";

const app = express();
const PORT = 3060;

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow requests from your React app
//     credentials: true, // Allow cookies to be sent with requests
//   })
// );
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://gift-seven-smoky.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// app.use("*", cors());


app.use(express.urlencoded({ extended: true }));


app.use(pinoHttp({ logger }));

connectDB();

app.use("/api/gifts", giftRoutes);
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
