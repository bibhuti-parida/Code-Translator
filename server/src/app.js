import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

// 🔹 Request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// Allow frontend (supports Vite dev ports on localhost)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

// Parse JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔹 API routes
app.use("/api", routes);

// 🔹 Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;