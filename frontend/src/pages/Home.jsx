import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Home() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await api.get("/shows");
        setShows(res.data);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      }
    };

    fetchShows();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Modex Booking Demo</h1>
      <Link to="/admin">Admin</Link>

      <h2>Available Shows</h2>

      {shows.length === 0 && <p>No shows available</p>}

      {shows.map((show) => (
        <div key={show.id} style={{ marginBottom: "20px" }}>
          <b>{show.name}</b>
          <br />
          Time: {new Date(show.startTime).toLocaleString()}
          <br />
          Seats: {show.totalSeats}
          <br />
          <Link to={`/booking/${show.id}`}>
            <button>Book</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
