// backend/src/booking.controller.js
import { prisma } from "./prismaClient.js";

export async function createBooking(req, res) {
  try {
    const { showId, seatNumbers } = req.body;

    if (!showId || !seatNumbers || !Array.isArray(seatNumbers)) {
      return res.status(400).json({ error: "showId and seatNumbers required" });
    }

    // Check for already-booked seats (concurrency-safe)
    const existing = await prisma.booking.findMany({
      where: {
        showId: Number(showId),
        seatNumber: { in: seatNumbers.map(Number) },
      },
    });

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Some seats already booked", status: "FAILED" });
    }

    await prisma.booking.createMany({
      data: seatNumbers.map((n) => ({
        showId: Number(showId),
        seatNumber: Number(n),
      })),
    });

    res.json({ status: "CONFIRMED" });
  } catch (err) {
    console.error("Error createBooking:", err);
    res
      .status(500)
      .json({ error: "Failed to create booking: " + err.message });
  }
}

