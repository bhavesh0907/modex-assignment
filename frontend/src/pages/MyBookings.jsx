import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("ticketbook_user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const storedRaw = localStorage.getItem("ticketbook_bookings");
      const stored = storedRaw ? JSON.parse(storedRaw) : [];

      // If we have a logged-in user, filter by his email
      const filtered =
        user?.email
          ? stored.filter((b) => b.userEmail === user.email)
          : stored;

      setBookings(filtered);
    } catch (err) {
      console.error("Failed to load bookings from localStorage", err);
      setBookings([]);
    }
  }, []);

  const confirmedCount = bookings.filter(
    (b) => b.status === "CONFIRMED"
  ).length;
  const pendingCount = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;
  const totalCount = bookings.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 16px",
        background:
          "linear-gradient(135deg, #6a11cb 0%, #2575fc 50%, #4e54c8 100%)",
        color: "#222",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ color: "#111", fontSize: "32px", fontWeight: 700 }}>
            My Bookings
          </h1>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            ← Back to Shows
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard label="Confirmed" value={confirmedCount} />
          <StatCard label="Pending" value={pendingCount} />
          <StatCard label="Total Bookings" value={totalCount} />
        </div>

        {/* Content */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "16px",
            padding: "32px 24px",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
          }}
        >
          {bookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bookings
                .slice()
                .reverse()
                .map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
            </div>
          )}
        </div>

        {/* Info box */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "#e3f2fd",
            borderRadius: "12px",
            padding: "16px 20px",
          }}
        >
          <h3 style={{ marginBottom: 8 }}>
            ❓ Booking Information
          </h3>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px" }}>
            <li>
              <strong>Confirmed Bookings:</strong> Your seats are reserved and
              guaranteed.
            </li>
            <li>
              <strong>Pending Bookings:</strong> Must be confirmed within 2
              minutes or seats may be released.
            </li>
            <li>
              <strong>Cancellation:</strong> You can cancel confirmed bookings
              anytime (demo only).
            </li>
            <li>
              <strong>Seat Price:</strong> Each seat costs ₹150.
            </li>
            <li>
              <strong>Show ID:</strong> Use this to view details about your
              booked show.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: "16px",
        padding: "16px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.2)",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: "14px", color: "#4b5563" }}>{label}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: 8 }}>
        No bookings yet
      </div>
      <p style={{ marginBottom: 16, color: "#4b5563" }}>
        You have not made any bookings. Browse shows and book tickets to get
        started!
      </p>
      <Link to="/">
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#22c55e",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Browse Shows
        </button>
      </Link>
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "16px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e5e7eb",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{booking.showName}</div>
        <div style={{ fontSize: "13px", color: "#4b5563" }}>
          {new Date(booking.startTime).toLocaleString()}
        </div>
        <div style={{ fontSize: "13px", marginTop: 4 }}>
          Seats: {booking.seatNumbers.join(", ")}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor:
              booking.status === "CONFIRMED" ? "#bbf7d0" : "#fee2e2",
            color:
              booking.status === "CONFIRMED" ? "#166534" : "#b91c1c",
          }}
        >
          {booking.status}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          Show ID: {booking.showId}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
