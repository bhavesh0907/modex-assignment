// backend/src/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import showRoutes from "./show.routes.js";
import bookingRoutes from "./booking.routes.js";

dotenv.config();

const app = express();

// --- CORS SETUP (frontend + local) ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://modex-assignment.vercel.app",
  "https://modex-assignment-6poywgh65-bhavesh0907s-projects.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow server-to-server or curl (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// --- BODY PARSER ---
app.use(express.json());

// --- ROOT + HEALTH CHECK ROUTES ---
app.get("/", (req, res) => {
  res.send("Modex backend running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- API ROUTES ---
app.use("/shows", showRoutes);       // /shows, /shows/:id
app.use("/bookings", bookingRoutes); // /bookings

// --- GLOBAL ERROR HANDLER (optional but safe) ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// --- START SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
