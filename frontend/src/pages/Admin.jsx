import { useState, useEffect } from "react";
import { api } from "../api";

export default function Admin() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [totalSeats, setTotalSeats] = useState(40);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = () => {
    api.get("/admin/shows")
      .then(res => setShows(res.data))
      .catch(() => alert("Failed to load shows"));
  };

  const createShow = async () => {
    if (!name || !startTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/admin/shows", {
        name,
        startTime,
        totalSeats: Number(totalSeats),
      });

      alert("Show created successfully!");
      loadShows();

      setName("");
      setStartTime("");
      setTotalSeats(40);

    } catch (err) {
      alert("Failed to create show");
    }
  };

  return (
    <div>
      <h2>Admin – Create Show</h2>

      <input placeholder="Show name"
             value={name} onChange={e => setName(e.target.value)} />

      <input type="datetime-local"
             value={startTime} onChange={e => setStartTime(e.target.value)} />

      <input type="number"
             value={totalSeats} onChange={e => setTotalSeats(e.target.value)} />

      <button onClick={createShow}>Create Show</button>

      <h3>All Shows</h3>

      {shows.map(s => (
        <div key={s.id} style={{ marginTop: "15px" }}>
          <strong>{s.name}</strong><br />
          Time: {new Date(s.startTime).toLocaleString()}<br />
          Seats: {s.availableSeats}/{s.totalSeats}
        </div>
      ))}
    </div>
  );
}
