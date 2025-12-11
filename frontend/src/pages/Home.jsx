import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    api.get("/shows")
      .then(res => setShows(res.data))
      .catch(() => alert("Failed to load shows"));
  }, []);

  return (
    <div>
      <h2>Available Shows</h2>

      {shows.length === 0 ? (
        <p>No shows available.</p>
      ) : (
        shows.map(show => (
          <div key={show.id} style={{ marginBottom: "20px" }}>
            <strong>{show.name}</strong><br />
            Time: {new Date(show.startTime).toLocaleString()}<br />
            Seats: {show.availableSeats}/{show.totalSeats}
            <br /><br />
            <Link to={`/booking/${show.id}`}>
              <button>Book</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
