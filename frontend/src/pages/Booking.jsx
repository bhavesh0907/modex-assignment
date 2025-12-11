import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";

function Booking() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await api.get(`/shows/${id}`);
        setShow(res.data);
      } catch (err) {
        console.error("Error fetching show:", err);
        alert("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const toggleSeat = (seatNumber, isBooked) => {
    if (isBooked) return; // do not allow clicking already booked seats

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      setBookingLoading(true);
      await api.post("/bookings", {
        showId: Number(id),
        seatNumbers: selectedSeats,
      });

      alert("Booking confirmed!");
      setSelectedSeats([]);

      // refresh show data to see updated seats
      const res = await api.get(`/shows/${id}`);
      setShow(res.data);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed. Some seats may already be booked.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading show...</div>;
  }

  if (!show) {
    return <div style={{ padding: "20px" }}>Show not found.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Modex Booking Demo</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">User Home</Link> | <Link to="/admin">Admin</Link>
      </nav>

      <h2>Booking – {show.name}</h2>
      <p>
        Time: {new Date(show.startTime).toLocaleString()} <br />
        Total seats: {show.totalSeats}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 40px)",
          gap: "8px",
          margin: "20px 0",
        }}
      >
        {Array.from({ length: show.totalSeats }, (_, i) => i + 1).map((seat) => {
          const isBooked =
            show.seats && show.seats.some((s) => s.number === seat && s.booked);
          const isSelected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              onClick={() => toggleSeat(seat, isBooked)}
              style={{
                width: "40px",
                height: "40px",
                cursor: isBooked ? "not-allowed" : "pointer",
                backgroundColor: isBooked
                  ? "red"
                  : isSelected
                  ? "green"
                  : "lightgray",
              }}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <button onClick={confirmBooking} disabled={bookingLoading}>
        {bookingLoading
          ? "Confirming..."
          : `Confirm Booking (${selectedSeats.length} seats)`}
      </button>
    </div>
  );
}

export default Booking;
