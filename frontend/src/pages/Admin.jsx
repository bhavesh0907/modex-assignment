import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

function Admin() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(40);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShows = async () => {
    try {
      const res = await api.get("/shows");
      setShows(res.data);
    } catch (err) {
      console.error("Error fetching shows:", err);
      alert("Failed to load shows");
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const createShow = async () => {
    if (!name || !time || !seats) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/shows", {
        name,
        startTime: time,
        totalSeats: Number(seats),
      });

      alert("Show created successfully!");
      setName("");
      setTime("");
      setSeats(40);
      fetchShows();
    } catch (err) {
      console.error("Error creating show:", err);
      alert("Failed to create show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Modex Booking Demo</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">User Home</Link> | <b>Admin</b>
      </nav>

      <h2>Create Show</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "320px" }}>
        <input
          type="text"
          placeholder="Show Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          type="number"
          min="1"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />

        <button onClick={createShow} disabled={loading}>
          {loading ? "Creating..." : "Create Show"}
        </button>
      </div>

      <h3 style={{ marginTop: "2rem" }}>All Shows</h3>
      {shows.length === 0 ? (
        <p>No shows created yet.</p>
      ) : (
        <ul>
          {shows.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong> –{" "}
              {new Date(s.startTime).toLocaleString()} – Seats:{" "}
              {s.totalSeats}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
