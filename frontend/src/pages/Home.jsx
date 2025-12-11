// frontend/src/pages/Home.jsx
import { Link } from "react-router-dom";

const shows = [
  {
    id: 1,
    title: "Avengers: Endgame",
    startTime: "2025-12-15T23:30:00",
    totalSeats: 100,
    availableSeats: 70,
  },
  {
    id: 2,
    title: "The Dark Knight",
    startTime: "2025-12-17T01:30:00",
    totalSeats: 120,
    availableSeats: 110,
  },
  {
    id: 3,
    title: "Inception",
    startTime: "2025-12-18T01:00:00",
    totalSeats: 80,
    availableSeats: 60,
  },
  {
    id: 4,
    title: "Interstellar",
    startTime: "2025-12-19T02:30:00",
    totalSeats: 150,
    availableSeats: 130,
  },
  {
    id: 5,
    title: "The Matrix",
    startTime: "2025-12-19T22:30:00",
    totalSeats: 100,
    availableSeats: 90,
  },
  {
    id: 6,
    title: "Pulp Fiction",
    startTime: "2025-12-21T03:30:00",
    totalSeats: 90,
    availableSeats: 85,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-400 to-purple-600 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Available Shows
        </h1>
        <p className="text-center text-indigo-100 mb-8">
          Browse and book your tickets
        </p>

        <div className="flex justify-center mb-8">
          <input
            disabled
            className="w-full max-w-xl px-4 py-2 rounded-lg border border-indigo-200 bg-white/80 text-gray-700 placeholder-gray-400"
            placeholder="Search shows..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => {
            const bookedSeats = show.totalSeats - show.availableSeats;
            const percentBooked =
              (bookedSeats / show.totalSeats) * 100 || 0;

            return (
              <div
                key={show.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {show.title}
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 uppercase">
                      show
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Start Time:</span>{" "}
                    {new Date(show.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Available Seats:</span>{" "}
                    {show.availableSeats} / {show.totalSeats}
                  </p>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-2 bg-green-500"
                      style={{ width: `${percentBooked}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/booking/${show.id}`}
                  state={{ show }} // IMPORTANT: pass show to Booking page
                  className="mt-2 block"
                >
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                    Book Now
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
