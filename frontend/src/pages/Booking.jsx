import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function Booking() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await api.get(`/shows/${id}`);
        setShow(res.data);
      } catch (err) {
        console.error("Error fetching show:", err);
      }
    };
    fetchShow();
  }, [id]);

  const toggleSeat = (seatNumber) => {
    setSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const confirm = async () => {
    try {
      await api.post(`/shows/${id}/book`, {
        seats,
      });

      alert("Booking confirmed!");
      setSeats([]);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to confirm booking");
    }
  };

  if (!show) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Modex Booking Demo</h1>
      <Link to="/">User Home</Link> | <Link to="/admin">Admin</Link>

      <h2>Booking Page</h2>

      <div>
        {Array.from({ length: show.totalSeats }, (_, i) => i + 1).map((seat) => (
          <button
            key={seat}
            onClick={() => toggleSeat(seat)}
            style={{
              margin: "5px",
              backgroundColor: seats.includes(seat) ? "green" : "lightgray",
            }}
          >
            {seat}
          </button>
        ))}
      </div>

      <button onClick={confirm}>Confirm Booking</button>
    </div>
  );
}

export default Booking;
