// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import showRoutes from "./show.routes.js";
import bookingRoutes from "./booking.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Modex backend running");
});

app.use("/", showRoutes);
app.use("/", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
