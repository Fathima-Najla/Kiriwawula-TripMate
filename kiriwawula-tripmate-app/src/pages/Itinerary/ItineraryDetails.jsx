
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:8000";

function ItineraryDetails() {
    const { id } = useParams();

    const [itinerary, setItinerary] = useState(null);
    const [places, setPlaces] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [plannedTime, setPlannedTime] = useState("09:00");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const loadDetails = async () => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/itineraries/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load trip details."
                );
            }

            if (!data.itinerary) {
                throw new Error("Trip details were not returned by the server.");
            }

            setItinerary(data.itinerary);
            setPlaces(data.itinerary.ItineraryPlaces || []);
        } catch (err) {
            setError(err.message || "Unable to load trip details.");
            setItinerary(null);
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    };

    const loadPlaces = async () => {
        try {
            const response = await fetch(`${API_URL}/tourist-places`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load tourist places.");
            }

            setAllPlaces(data.places || []);
        } catch (err) {
            setError(err.message || "Unable to load tourist places.");
        }
    };

    useEffect(() => {
        setLoading(true);
        loadPlaces();
        loadDetails();
    }, [id]);

    const addPlace = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!selectedPlace) {
            setError("Please select a tourist place.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/itinerary-places`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    itineraryId: Number(id),
                    placeId: Number(selectedPlace),
                    visitOrder: places.length + 1,
                    plannedTime,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to add place.");
            }

            setMessage("Tourist place added to your trip.");
            setSelectedPlace("");
            await loadDetails();
        } catch (err) {
            setError(err.message);
        }
    };

    const removePlace = async (itineraryPlaceId) => {
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/itinerary-places/${itineraryPlaceId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to remove place.");
            }

            setMessage("Place removed from your trip.");
            await loadDetails();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <main style={styles.page}>Loading trip details...</main>;
    }

    if (!itinerary) {
        return (
            <main style={styles.page}>
                <p>{error || "Trip not found."}</p>
                <Link to="/itinerary">Back to My Itinerary</Link>
            </main>
        );
    }

    return (
        <main style={styles.page}>
            <nav style={styles.navbar}>
                <Link to="/" style={styles.logo}>
                    Kiriwawula TripMate
                </Link>
                <Link to="/itinerary" style={styles.backLink}>
                    ← My Itinerary
                </Link>
            </nav>

            <section style={styles.container}>
                <p style={styles.eyebrow}>YOUR JOURNEY</p>
                <h1 style={styles.heading}>{itinerary.itineraryName}</h1>
                <p style={styles.date}>
                    Travel date: {itinerary.travelDate || "Not selected"}
                </p>

                <form onSubmit={addPlace} style={styles.form}>
                    <h2>Add a Tourist Place</h2>

                    <label htmlFor="place" style={styles.label}>
                        Select Place
                    </label>
                    <select
                        id="place"
                        value={selectedPlace}
                        onChange={(e) => setSelectedPlace(e.target.value)}
                        required
                        style={styles.input}
                    >
                        <option value="">Choose a tourist place</option>
                        {allPlaces.map((place) => (
                            <option key={place.placeId} value={place.placeId}>
                                {place.placeName}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="time" style={styles.label}>
                        Planned Visit Time
                    </label>
                    <input
                        id="time"
                        type="time"
                        value={plannedTime}
                        onChange={(e) => setPlannedTime(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <button type="submit" style={styles.button}>
                        + Add Place to Trip
                    </button>
                </form>

                {message && <p role="status" style={styles.success}>{message}</p>}
                {error && <p role="alert" style={styles.error}>{error}</p>}

                <h2 style={styles.subheading}>Your Planned Stops</h2>

                {places.length === 0 ? (
                    <p>No places added yet. Choose a place above to begin.</p>
                ) : (
                    <div style={styles.list}>
                        {places.map((item) => (
                            <article
                                key={item.itineraryPlaceId}
                                style={styles.card}
                            >
                                <div style={styles.number}>{item.visitOrder}</div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={styles.placeName}>
                                        {item.TouristPlace?.placeName ||
                                            `Place ${item.placeId}`}
                                    </h3>
                                    <p style={styles.date}>
                                        {item.TouristPlace?.location || ""}
                                    </p>
                                    <p style={styles.date}>
                                        Planned time: {item.plannedTime || "Not set"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removePlace(item.itineraryPlaceId)}
                                    style={styles.deleteButton}
                                >
                                    Remove
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f8f7f3",
        fontFamily: "Arial, sans-serif",
        color: "#24372b",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 7%",
        background: "#fff",
        flexWrap: "wrap",
        gap: "15px",
    },
    logo: {
        color: "#1f5135",
        fontWeight: "bold",
        textDecoration: "none",
        fontSize: "20px",
    },
    backLink: {
        color: "#1f5135",
        textDecoration: "none",
    },
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "45px 24px",
    },
    eyebrow: {
        color: "#1f7650",
        letterSpacing: "3px",
        fontWeight: "bold",
        fontSize: "12px",
    },
    heading: {
        fontSize: "38px",
        marginBottom: "10px",
    },
    date: {
        color: "#657166",
        fontSize: "14px",
        lineHeight: 1.6,
    },
    form: {
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        margin: "30px 0",
        boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
    },
    label: {
        display: "block",
        fontWeight: "bold",
        margin: "18px 0 8px",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d9ded8",
        borderRadius: "7px",
        fontSize: "15px",
        boxSizing: "border-box",
        background: "#fff",
    },
    button: {
        marginTop: "20px",
        padding: "12px 18px",
        background: "#1f5135",
        color: "#fff",
        border: 0,
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    subheading: {
        marginTop: "35px",
    },
    list: {
        display: "grid",
        gap: "15px",
    },
    card: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        flexWrap: "wrap",
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        border: "1px solid #e8e8e0",
    },
    number: {
        width: "38px",
        height: "38px",
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        background: "#e2eee4",
        color: "#1f5135",
        fontWeight: "bold",
    },
    placeName: {
        margin: "0 0 5px",
    },
    deleteButton: {
        padding: "9px 12px",
        background: "#fff",
        color: "#b42318",
        border: "1px solid #c75b52",
        borderRadius: "6px",
        cursor: "pointer",
    },
    success: {
        color: "#176b42",
    },
    error: {
        color: "#b42318",
    },
};

export default ItineraryDetails;
