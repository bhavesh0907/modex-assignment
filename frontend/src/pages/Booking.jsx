import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import SeatGrid from "../components/SeatGrid";

export default function Booking() {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  const loadSeats = () => {
    api.get(`/shows/${showId}`)
      .then(res => setSeats(res.data.seats))
      .catch(() => alert("Failed to load seats"));
  };

  useEffect(() => {
    loadSeats();
  }, []);

  const toggleSeat = (number) => {
    if (selected.includes(number)) {
      setSelected(selected.filter(n => n !== number));
    } else {
      setSelected([...selected, number]);
    }
  };

  const confirmBooking = async () => {
    try {
      await api.post("/bookings", {
        showId: Number(showId),
        seatNumbers: selected
      });

      alert("Booking confirmed!");
      setSelected([]);
      loadSeats();

    } catch (err) {
      alert("Booking failed: seats already booked");
    }
  };

  return (
    <div>
      <h2>Booking Page</h2>

      <SeatGrid
        seats={seats}
        selectedSeats={selected}
        onToggle={toggleSeat}
      />

      <button onClick={confirmBooking} style={{ marginTop: "20px" }}>
        Confirm Booking
      </button>
    </div>
  );
}
