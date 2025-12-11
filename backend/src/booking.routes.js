// backend/src/booking.routes.js
import express from "express";
import { createBooking } from "./booking.controller.js";

const router = express.Router();

// User booking endpoint
router.post("/bookings", createBooking);

export default router;

