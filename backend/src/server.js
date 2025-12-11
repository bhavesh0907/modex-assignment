// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import showRoutes from "./show.routes.js";
import bookingRoutes from "./booking.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// IMPORTANT: allow both localhost and Vercel frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://modex-assignment-6poywgh65-bhavesh0907s-projects.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow mobile apps / curl etc. with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.send("Modex backend running");
});

// Routes
app.use(showRoutes);
app.use(bookingRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
