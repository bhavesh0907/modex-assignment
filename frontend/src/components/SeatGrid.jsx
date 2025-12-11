export default function SeatGrid({ seats, selectedSeats, onToggle }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(10, 40px)",
      gap: "10px",
      marginTop: "20px"
    }}>
      {seats.map(seat => {
        let color = seat.booked ? "#888" : "#ddd";
        if (selectedSeats.includes(seat.number)) color = "lightgreen";

        return (
          <div
            key={seat.number}
            onClick={() => !seat.booked && onToggle(seat.number)}
            style={{
              width: "40px",
              height: "40px",
              background: color,
              textAlign: "center",
              lineHeight: "40px",
              cursor: seat.booked ? "not-allowed" : "pointer"
            }}
          >
            {seat.number}
          </div>
        );
      })}
    </div>
  );
}
