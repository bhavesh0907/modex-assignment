// backend/src/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173",
  "https://modex-assignment.vercel.app",
  "https://modex-assignment-6poywgh65-bhavesh0907s-projects.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// ---------- BASIC ROUTES ----------
app.get("/", (req, res) => {
  res.send("Modex backend running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- SHOW ROUTES ----------

// GET /shows – list all shows with bookedSeats
app.get("/shows", async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      include: { bookings: true },
      orderBy: { startTime: "asc" },
    });

    const result = shows.map((s) => ({
      id: s.id,
      name: s.name,
      startTime: s.startTime,
      totalSeats: s.totalSeats,
      bookedSeats: s.bookings.length,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ error: "Failed to list shows" });
  }
});

// POST /admin/shows – create a new show
app.post("/admin/shows", async (req, res) => {
  const { name, startTime, totalSeats } = req.body;

  if (!name || !startTime || !totalSeats) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const show = await prisma.show.create({
      data: {
        name,
        startTime: new Date(startTime),
        totalSeats: Number(totalSeats),
      },
    });

    res.status(201).json(show);
  } catch (err) {
    console.error("Error creating show:", err);
    res.status(500).json({ error: "Failed to create show" });
  }
});

// GET /shows/:id – show details + seat map
app.get("/shows/:id", async (req, res) => {
  const showId = Number(req.params.id);

  if (Number.isNaN(showId)) {
    return res.status(400).json({ error: "Invalid show id" });
  }

  try {
    const show = await prisma.show.findUnique({
      where: { id: showId },
      include: { bookings: true },
    });

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    const bookedSeatNumbers = show.bookings.map((b) => b.seatNumber);

    const seats = Array.from({ length: show.totalSeats }, (_, i) => {
      const number = i + 1;
      return {
        number,
        booked: bookedSeatNumbers.includes(number),
      };
    });

    res.json({
      id: show.id,
      name: show.name,
      startTime: show.startTime,
      totalSeats: show.totalSeats,
      seats,
    });
  } catch (err) {
    console.error("Error fetching show details:", err);
    res.status(500).json({ error: "Failed to get show details" });
  }
});

// ---------- BOOKING ROUTES ----------

// POST /bookings – book one or more seats
// body: { showId: number, seatNumbers: number[] }
app.post("/bookings", async (req, res) => {
  const { showId, seatNumbers } = req.body;

  if (!showId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res
      .status(400)
      .json({ error: "showId and seatNumbers[] are required" });
  }

  try {
    // Check for already booked seats
    const existing = await prisma.booking.findMany({
      where: {
        showId: Number(showId),
        seatNumber: { in: seatNumbers.map(Number) },
      },
      select: { seatNumber: true },
    });

    if (existing.length > 0) {
      const alreadyBooked = existing.map((b) => b.seatNumber);
      return res.status(409).json({
        error: "Some seats are already booked",
        seats: alreadyBooked,
      });
    }

    // Create bookings
    await prisma.booking.createMany({
      data: seatNumbers.map((n) => ({
        showId: Number(showId),
        seatNumber: Number(n),
      })),
    });

    res.status(201).json({ message: "Booking confirmed" });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
