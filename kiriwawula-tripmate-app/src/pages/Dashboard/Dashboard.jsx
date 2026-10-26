
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadItineraries = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:8000/itineraries/mine",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load itineraries."
                    );
                }

                setItineraries(data.itineraries || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadItineraries();
    }, [navigate]);

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar">
                <h2>Kiriwawula TripMate</h2>
                <div>
                    <button onClick={() => navigate("/")}>Home</button>
                    <button onClick={() => navigate("/places")}>
                        Explore Places
                    </button>
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    }}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <h1>My Itineraries</h1>
                <p className="dashboard-intro">
                    View your planned trips and the places you want to visit.
                </p>

                {loading && <p>Loading your itineraries...</p>}

                {error && <p className="dashboard-error">{error}</p>}

                {!loading && !error && itineraries.length === 0 && (
                    <div className="empty-itineraries">
                        <h2>No itineraries yet</h2>
                        <p>Create a trip or explore tourist places to get started.</p>
                        <button onClick={() => navigate("/places")}>
                            Explore Tourist Places
                        </button>
                    </div>
                )}

                {!loading && !error && itineraries.map((itinerary) => (
                    <article
                        className="itinerary-card"
                        key={itinerary.itineraryId}
                    >
                        <h2>{itinerary.itineraryName}</h2>

                        <p>
                            Travel date: {itinerary.travelDate
                                ? String(itinerary.travelDate).slice(0, 10)
                                : "Not set"}
                        </p>

                        <h3>Planned places</h3>

                        {itinerary.ItineraryPlaces?.length > 0 ? (
                            <ul>
                                {itinerary.ItineraryPlaces.map((item) => (
                                    <li key={item.itineraryPlaceId}>
                                        {item.TouristPlace?.placeName ||
                                            `Place ID: ${item.placeId}`}
                                        {item.plannedTime
                                            ? ` — ${item.plannedTime}`
                                            : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No places added to this trip yet.</p>
                        )}
                    </article>
                ))}
            </main>
        </div>
    );
}

export default Dashboard;
