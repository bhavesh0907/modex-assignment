import { useState, useEffect } from "react";
import api from "../api";

function Admin() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(40);
  const [shows, setShows] = useState([]);

  const fetchShows = async () => {
    try {
      const res = await api.get("/shows");
      setShows(res.data);
    } catch (err) {
      console.error("Error fetching shows:", err);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const createShow = async () => {
    try {
      await api.post("/shows", {
        name,
        startTime: time,
        totalSeats: Number(seats),
      });

      alert("Show created successfully!");
      fetchShows();

      setName("");
      setTime("");
      setSeats(40);
    } catch (err) {
      console.error("Error creating show:", err);
      alert("Failed to create show");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Modex Booking Demo</h1>
      <a href="/">User Home</a> | <b>Admin</b>

      <h2>Admin – Create Show</h2>

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
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
      />

      <button onClick={createShow}>Create Show</button>

      <h3>All Shows</h3>
      {shows.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))}
    </div>
  );
}

export default Admin;
