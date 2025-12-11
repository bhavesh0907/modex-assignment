import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../Api.js";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Load show details
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
    if (isBooked) return; // cannot select already booked seat

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  // Helper: save booking to localStorage for MyBookings page
  const saveBookingToLocalStorage = (payload) => {
    try {
      const userRaw = localStorage.getItem("ticketbook_user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const existingRaw = localStorage.getItem("ticketbook_bookings");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];

      const bookingRecord = {
        id: Date.now(), // simple unique id
        showId: payload.showId,
        showName: show.name,
        startTime: show.startTime,
        seatNumbers: payload.seatNumbers,
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
        userName: user?.name || "",
        userEmail: user?.email || "",
      };

      const updated = [...existing, bookingRecord];
      localStorage.setItem("ticketbook_bookings", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save booking locally", e);
    }
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      setBookingLoading(true);

      const payload = {
        showId: Number(id),
        seatNumbers: selectedSeats,
      };

      // Call backend
      await api.post("/bookings", payload);

      // Save for MyBookings screen
      saveBookingToLocalStorage(payload);

      alert("Booking confirmed!");
      setSelectedSeats([]);

      // refresh show data to see updated seats
      const res = await api.get(`/shows/${id}`);
      setShow(res.data);

      // Optional: redirect user to My Bookings
      navigate("/my-bookings");
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
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>TicketBook</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/my-bookings">My Bookings</Link>
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
        {Array.from({ length: show.totalSeats }, (_, i) => i + 1).map(
          (seat) => {
            const isBooked =
              show.seats &&
              show.seats.some((s) => s.number === seat && s.booked);
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat, isBooked)}
                style={{
                  width: "40px",
                  height: "40px",
                  cursor: isBooked ? "not-allowed" : "pointer",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  backgroundColor: isBooked
                    ? "#e53935"
                    : isSelected
                    ? "#43a047"
                    : "#90a4ae",
                }}
              >
                {seat}
              </button>
            );
          }
        )}
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
