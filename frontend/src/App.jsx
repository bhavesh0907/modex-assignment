import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Booking from "./pages/Booking";

export default function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Modex Booking Demo</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">User Home</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking/:showId" element={<Booking />} />
      </Routes>
    </div>
  );
}
