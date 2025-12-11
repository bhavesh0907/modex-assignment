// frontend/src/pages/Booking.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "ticketbook_bookings";

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // show is passed from Home via Link state
  const initialShow = location.state?.show || null;

  const [show] = useState(initialShow);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(
    !initialShow ? "Show details not available. Please go back and open again from Home." : ""
  );

  // Basic 10x10 grid or up to totalSeats
  const seatNumbers = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: show.totalSeats }, (_, i) => i + 1);
  }, [show]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleConfirm = () => {
    if (!show) return;

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const existing = loadBookings();

      const newBooking = {
        id: Date.now(),
        showId: show.id,
        showTitle: show.title,
        startTime: show.startTime,
        seats: selectedSeats,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      saveBookings([...existing, newBooking]);

      setSelectedSeats([]);
      alert("Booking confirmed!");
      navigate("/my-bookings");
    } catch (e) {
      console.error("Error saving booking:", e);
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-400 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-semibold mb-3">
            Show not found
          </h1>
          <p className="text-gray-600 mb-6">
            Please return to the home page and open the show again.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg"
          >
            Back to Shows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-400 to-purple-600 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-6">
          <Link to="/" className="text-xl font-bold text-yellow-200">
            🎟️ TicketBook
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="text-white hover:underline">
              Home
            </Link>
            <Link
              to="/my-bookings"
              className="text-white hover:underline"
            >
              My Bookings
            </Link>
          </nav>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-1">{show.title}</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Show ID:</span> {show.id}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Start Time:</span>{" "}
            {new Date(show.startTime).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Total Seats:</span>{" "}
            {show.totalSeats}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-2">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Select Your Seats
          </h2>

          <div className="grid grid-cols-8 gap-3 mb-6 justify-items-center">
            {seatNumbers.map((seat) => {
              const isSelected = selectedSeats.includes(seat);
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  className={`w-10 h-10 rounded-md text-sm font-semibold border
                    ${
                      isSelected
                        ? "bg-green-500 text-white border-green-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {seat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Selected Seats:{" "}
                {selectedSeats.length === 0
                  ? "None"
                  : selectedSeats.join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                Seat Price: ₹150 per seat
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                Total: ₹{selectedSeats.length * 150}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isSubmitting || selectedSeats.length === 0}
              className={`px-5 py-2 rounded-lg font-semibold text-white ${
                isSubmitting || selectedSeats.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting
                ? "Confirming..."
                : `Confirm Booking (${selectedSeats.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
