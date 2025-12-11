// backend/src/show.controller.js
import { prisma } from "./prismaClient.js";

export async function listShows(req, res) {
  try {
    const shows = await prisma.show.findMany({
      include: { bookings: true },
      orderBy: { startTime: "asc" },
    });

    const mapped = shows.map((s) => ({
      id: s.id,
      name: s.name,
      startTime: s.startTime,
      totalSeats: s.totalSeats,
      availableSeats: s.totalSeats - s.bookings.length,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Error listShows:", err);
    res.status(500).json({ error: "Failed to list shows: " + err.message });
  }
}

export async function listShowsAdmin(req, res) {
  return listShows(req, res);
}

export async function createShow(req, res) {
  try {
    const { name, startTime, totalSeats } = req.body;

    if (!name || !startTime || !totalSeats) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const show = await prisma.show.create({
      data: {
        name,
        startTime: new Date(startTime),
        totalSeats: Number(totalSeats),
      },
    });

    res.json(show);
  } catch (err) {
    console.error("Error createShow:", err);
    res
      .status(500)
      .json({ error: "Failed to create show: " + err.message });
  }
}

export async function getShowWithSeats(req, res) {
  try {
    const id = Number(req.params.id);

    const show = await prisma.show.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    const seats = [];
    for (let i = 1; i <= show.totalSeats; i++) {
      seats.push({
        number: i,
        booked: show.bookings.some((b) => b.seatNumber === i),
      });
    }

    res.json({
      id: show.id,
      name: show.name,
      startTime: show.startTime,
      totalSeats: show.totalSeats,
      seats,
    });
  } catch (err) {
    console.error("Error getShowWithSeats:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch show: " + err.message });
  }
}

