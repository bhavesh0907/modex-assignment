// frontend/src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "ticketbook_bookings";

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const pendingCount = bookings.filter(
    (b) => b.status === "pending"
  ).length;
  const totalCount = bookings.length;

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
            <span className="text-white font-semibold">
              My Bookings
            </span>
          </nav>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black/80"
          >
            ← Back to Shows
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {confirmedCount}
            </div>
            <div className="text-gray-600 text-sm">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {pendingCount}
            </div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {totalCount}
            </div>
            <div className="text-gray-600 text-sm">Total Bookings</div>
          </div>
        </div>

        {/* Bookings list */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mb-8">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">
              No bookings yet
            </h2>
            <p className="text-gray-600 mb-4">
              You haven&apos;t made any bookings. Browse shows and book
              tickets to get started!
            </p>
            <Link
              to="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg"
            >
              Browse Shows
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Your Bookings
            </h2>
            <div className="space-y-3">
              {bookings
                .slice()
                .reverse()
                .map((b) => (
                  <div
                    key={b.id}
                    className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {b.showTitle}
                      </div>
                      <div className="text-sm text-gray-600">
                        Show ID: {b.showId}
                      </div>
                      <div className="text-sm text-gray-600">
                        Time:{" "}
                        {new Date(b.startTime).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Seats: {b.seats.join(", ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Booked on{" "}
                        {new Date(b.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span className="text-red-500 text-xl">?</span> Booking
            Information
          </h3>
          <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
            <li>
              <strong>Confirmed Bookings:</strong> Your seats are
              reserved and guaranteed.
            </li>
            <li>
              <strong>Pending Bookings:</strong> Must be confirmed
              within 2 minutes or seats are released. (For now, all
              bookings are marked confirmed.)
            </li>
            <li>
              <strong>Cancellation:</strong> You can extend this page to
              support cancellation and automatic refunds.
            </li>
            <li>
              <strong>Seat Price:</strong> Each seat costs ₹150.
            </li>
            <li>
              <strong>Show ID:</strong> Use this to view details about
              your booked show.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
