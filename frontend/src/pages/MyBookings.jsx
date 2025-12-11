// frontend/src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BOOKINGS_KEY = "ticketbook_bookings";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  // Only read from localStorage – no API calls here
  useEffect(() => {
    const userJson = localStorage.getItem("ticketbook_user");
    if (!userJson) {
      navigate("/login");
      return;
    }
    const u = JSON.parse(userJson);
    setUser(u);

    const stored =
      JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]") || [];

    // show only bookings for this user
    const mine = stored.filter(
      (b) => b.userEmail === u.email || b.userName === u.name
    );

    setBookings(mine);
    setLastUpdated(new Date());
  }, [navigate]);

  // derive stats
  const total = bookings.length;
  const confirmed = bookings.filter(
    (b) => !b.status || b.status === "confirmed"
  ).length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const handleBrowse = () => {
    navigate("/");
  };

  return (
    <div className="page bookings-page">
      <header className="navbar">
        <div className="logo">🎟️ TicketBook</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/my-bookings" className="active">
            My Bookings
          </Link>
        </nav>
        <div className="user-info">{user?.name}</div>
      </header>

      <main className="bookings-main">
        <div className="page-title-row">
          <h1>📋 My Bookings</h1>
          <button className="btn-secondary" onClick={handleBrowse}>
            ← Back to Shows
          </button>
        </div>

        <p className="live-indicator">
          🟢 Local data • Last updated{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString()
            : "just now"}
        </p>

        {/* Stats cards */}
        <section className="stats-grid">
          <div className="stat-card confirmed">
            <div className="stat-number">{confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card cancelled">
            <div className="stat-number">{cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
          <div className="stat-card total">
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total</div>
          </div>
        </section>

        {/* Content */}
        {bookings.length === 0 ? (
          <section className="no-bookings">
            <div className="no-bookings-icon">🎬</div>
            <h2>No bookings yet</h2>
            <p>
              You haven&apos;t made any bookings. Browse shows and
              book tickets to get started!
            </p>
            <button className="btn-primary" onClick={handleBrowse}>
              Browse Shows
            </button>

            <div className="info-panel">
              <h3>❓ Booking Information</h3>
              <ul>
                <li>
                  <b>Confirmed Bookings:</b> Your seats are reserved
                  and guaranteed.
                </li>
                <li>
                  <b>Pending Bookings:</b> Must be confirmed within a
                  short time or seats may be released.
                </li>
                <li>
                  <b>Cancellation:</b> You can cancel confirmed
                  bookings (if implemented) and see them here.
                </li>
                <li>
                  <b>Seat Price:</b> Each seat costs ₹150 (for
                  reference).
                </li>
              </ul>
            </div>
          </section>
        ) : (
          <section className="bookings-list">
            {bookings.map((b) => (
              <div key={b.bookingId} className="booking-card">
                <div className="booking-header">
                  <h3>{b.showName}</h3>
                  <span className={`badge badge-${b.status || "confirmed"}`}>
                    {b.status || "confirmed"}
                  </span>
                </div>
                <p>
                  <b>Show Time:</b>{" "}
                  {b.startTime
                    ? new Date(b.startTime).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <b>Seats:</b>{" "}
                  {b.seatNumbers
                    .slice()
                    .sort((a, c) => a - c)
                    .join(", ")}
                </p>
                <p>
                  <b>Booked at:</b>{" "}
                  {b.createdAt
                    ? new Date(b.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default MyBookings;
