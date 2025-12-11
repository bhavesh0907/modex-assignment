// backend/src/show.routes.js
import express from "express";
import {
  listShows,
  listShowsAdmin,
  createShow,
  getShowWithSeats,
} from "./show.controller.js";

const router = express.Router();

// Public: list shows
router.get("/shows", listShows);

// Admin: list shows
router.get("/admin/shows", listShowsAdmin);

// Admin: create show
router.post("/admin/shows", createShow);

// Public: show details + seats
router.get("/shows/:id", getShowWithSeats);

export default router;

