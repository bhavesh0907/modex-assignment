import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      try {
        const res = await api.get("/shows");
        setShows(res.data);
      } catch (err) {
        console.error("Failed to fetch shows", err);
        alert("Failed to load shows");
      } finally {
        setLoading(false);
      }
    }

    fetchShows();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading shows...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Modex Booking Demo</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">User Home</Link> | <Link to="/admin">Admin</Link>
      </nav>

      <h2>Available Shows</h2>

      {shows.length === 0 ? (
        <p>No shows available.</p>
      ) : (
        <ul>
          {shows.map((show) => (
            <li key={show.id} style={{ marginBottom: "0.75rem" }}>
              <strong>{show.name}</strong>
              <br />
              Time: {new Date(show.startTime).toLocaleString()}
              <br />
              Seats available:{" "}
              {show.availableSeats ?? show.totalSeats}/{show.totalSeats}
              <br />
              <Link to={`/booking/${show.id}`}>
                <button style={{ marginTop: "0.25rem" }}>Book</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
