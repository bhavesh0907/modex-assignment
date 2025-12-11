// frontend/src/pages/Booking.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

const BOOKINGS_KEY = "ticketbook_bookings";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [loadingShow, setLoadingShow] = useState(true);
  const [seatCount] = useState(160); // you can change this if needed
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  // ------- Load show details from backend (one time) -------
  useEffect(() => {
    let cancelled = false;

    async function fetchShow() {
      setLoadingShow(true);
      setError("");

      try {
        const res = await api.get(`/shows/${id}`);
        if (!cancelled) {
          setShow(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching show:", err);
          setError(
            "Failed to load show details. Please refresh or try again in a moment."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingShow(false);
        }
      }
    }

    fetchShow();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ------- Seat selection -------
  const toggleSeat = (seatNumber, isBooked) => {
    if (isBooked || bookingLoading) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  // ------- Confirm booking -------
  const confirmBooking = async () => {
    if (!show) return;
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const userJson = localStorage.getItem("ticketbook_user");
    if (!userJson) {
      alert("Please login again to continue booking.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userJson);

    try {
      setBookingLoading(true);
      setError("");

      // 1) Create booking on backend
      await api.post("/bookings", {
        showId: Number(id),
        seatNumbers: selectedSeats,
        userName: user.name,
        userEmail: user.email,
      });

      // 2) Store a simplified booking locally for MyBookings screen
      const existing =
        JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]") || [];

      const now = new Date();
      const newBooking = {
        bookingId: Date.now(), // local id
        showId: show.id,
        showName: show.title || show.name,
        startTime: show.startTime,
        seatNumbers: [...selectedSeats],
        totalSeats: show.totalSeats,
        status: "confirmed",
        createdAt: now.toISOString(),
        userName: user.name,
        userEmail: user.email,
      };

      localStorage.setItem(
        BOOKINGS_KEY,
        JSON.stringify([...existing, newBooking])
      );

      alert("Booking confirmed!");
      setSelectedSeats([]);

      // Optional: reload show from backend to update availability
      const refreshed = await api.get(`/shows/${id}`);
      setShow(refreshed.data);

      // Navigate to My Bookings page
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        "Booking failed. Some seats may already be booked or the server is busy."
      );
      alert(
        "Booking failed. Please try again. If the problem continues, refresh the page."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ------- Render helpers -------
  if (loadingShow) {
    return (
      <div className="page booking-page">
        <div className="navbar">
          <Link to="/">Home</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
        <div className="loader">Loading seat layout...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="page booking-page">
        <div className="navbar">
          <Link to="/">Home</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
        <p style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
          Failed to load show. Please go back to the shows list.
        </p>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/">
            <button>Back to Shows</button>
          </Link>
        </div>
      </div>
    );
  }

  // seats array [1..seatCount]
  const seatsArray = Array.from({ length: seatCount }, (_, i) => i + 1);

  // if backend sends booked seats, mark them
  const bookedSeatNumbers =
    show.seats?.filter((s) => s.booked).map((s) => s.number) || [];

  return (
    <div className="page booking-page">
      <header className="navbar">
        <div className="logo">🎟️ TicketBook</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </nav>
      </header>

      <main className="booking-main">
        <section className="booking-header">
          <h1>{show.title || show.name}</h1>
          <p>
            Start Time:{" "}
            {show.startTime
              ? new Date(show.startTime).toLocaleString()
              : "N/A"}
          </p>
          <p>
            Available Seats:{" "}
            {show.availableSeats ?? show.totalSeats - bookedSeatNumbers.length}{" "}
            / {show.totalSeats}
          </p>
        </section>

        {error && (
          <div className="banner banner-error" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <section className="seat-layout">
          <h2>Select Seats</h2>
          <div className="seat-grid">
            {seatsArray.map((seatNumber) => {
              const isBooked = bookedSeatNumbers.includes(seatNumber);
              const isSelected = selectedSeats.includes(seatNumber);

              let className = "seat";
              if (isBooked) className += " seat-booked";
              else if (isSelected) className += " seat-selected";

              return (
                <button
                  key={seatNumber}
                  className={className}
                  disabled={isBooked || bookingLoading}
                  onClick={() => toggleSeat(seatNumber, isBooked)}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        </section>

        <section className="booking-actions">
          <p>
            Selected Seats:{" "}
            {selectedSeats.length === 0
              ? "None"
              : selectedSeats.sort((a, b) => a - b).join(", ")}
          </p>
          <button
            onClick={confirmBooking}
            disabled={bookingLoading || selectedSeats.length === 0}
          >
            {bookingLoading
              ? "Confirming..."
              : `Confirm Booking (${selectedSeats.length} seats)`}
          </button>
        </section>
      </main>
    </div>
  );
}

export default Booking;
