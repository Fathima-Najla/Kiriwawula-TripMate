
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_URL = "http://localhost:8000";

function MyItinerary() {
    const location = useLocation();

const selectedPlace = location.state || null;
    const [itineraries, setItineraries] = useState([]);
    const [itineraryName, setItineraryName] = useState(
    location.state?.placeName
        ? `${location.state.placeName} Trip`
        : ""
);
    const [travelDate, setTravelDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [needsLogin, setNeedsLogin] = useState(false);

    const getToken = () => localStorage.getItem("token");

    const handleAuthError = () => {
        localStorage.removeItem("token");
        setNeedsLogin(true);
        setItineraries([]);
        setError("");
        setMessage("Your session has expired. Please log in again.");
    };

    const loadItineraries = async () => {
        const token = getToken();

        if (!token) {
            setNeedsLogin(true);
            setItineraries([]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/itineraries/mine`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to load trips.");
            }

            setNeedsLogin(false);
            setItineraries(data.itineraries || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItineraries();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const token = getToken();

        if (!token) {
            setNeedsLogin(true);
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`${API_URL}/itineraries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    itineraryName: itineraryName.trim(),
                    travelDate: travelDate || null,
                }),
            });

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to create trip.");
            }

            setItineraryName("");
            setTravelDate("");
            setMessage("Your trip was created successfully.");
            await loadItineraries();
        } catch (err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (itineraryId) => {
        if (!window.confirm("Are you sure you want to delete this trip?")) {
            return;
        }

        setMessage("");
        setError("");

        const token = getToken();

        if (!token) {
            setNeedsLogin(true);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/itineraries/${itineraryId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete trip.");
            }

            setMessage("Trip deleted successfully.");
            await loadItineraries();
        } catch (err) {
            setError(err.message || "Unable to delete trip.");
        }
    };

    return (
        <main style={styles.page}>
            <nav style={styles.navbar}>
                <Link to="/" style={styles.logo}>
                    Kiriwawula TripMate
                </Link>

                <div style={styles.navLinks}>
                    <Link to="/">Home</Link>
                    <Link to="/places">Explore Places</Link>
                    <Link to="/map">Map</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </div>
            </nav>

            <section style={styles.container}>
                <p style={styles.eyebrow}>YOUR TRAVEL PLANS</p>

                <h1 style={styles.heading}>My Itinerary</h1>

                <p style={styles.intro}>
                    Plan your perfect day around Kiriwawula and Kandy.
                    Create a trip and organise the places you want to visit.
                </p>

                {needsLogin ? (
                    <div style={styles.form}>
                        <h2 style={styles.formHeading}>Login required</h2>

                        <p style={styles.loginText}>
                            Please log in to create a trip and view your
                            saved itineraries.
                        </p>

                        <div style={styles.actions}>
                            <Link to="/login" style={styles.viewButton}>
                                Log In
                            </Link>

                            <Link to="/signup" style={styles.viewButton}>
                                Create an Account
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleCreate} style={styles.form}>
                        <h2 style={styles.formHeading}>Create a New Trip</h2>

                        <label htmlFor="tripName" style={styles.label}>
                            Trip Name
                        </label>

                        <input
                            id="tripName"
                            type="text"
                            placeholder="e.g. Kandy One-Day Trip"
                            value={itineraryName}
                            onChange={(e) => setItineraryName(e.target.value)}
                            required
                            maxLength={150}
                            style={styles.input}
                        />

                        <label htmlFor="travelDate" style={styles.label}>
                            Travel Date
                        </label>

                        <input
                            id="travelDate"
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            style={styles.input}
                        />

                        <button
                            type="submit"
                            disabled={saving}
                            style={styles.button}
                        >
                            {saving ? "Creating..." : "+ Create Trip"}
                        </button>
                    </form>
                )}

                {message && (
                    <p role="status" style={styles.success}>
                        {message}
                    </p>
                )}

                {error && (
                    <p role="alert" style={styles.error}>
                        {error}
                    </p>
                )}

                {!needsLogin && (
                    <section style={styles.tripSection}>
                        <h2 style={styles.listHeading}>Your Saved Trips</h2>

                        {loading && <p>Loading your trips...</p>}

                        {!loading && !error && itineraries.length === 0 && (
                            <div style={styles.empty}>
                                <h3>No trips yet</h3>
                                <p>
                                    Create your first trip using the form above.
                                </p>
                            </div>
                        )}

                        <div style={styles.tripGrid}>
                            {itineraries.map((trip) => (
                                <article
                                    key={trip.itineraryId}
                                    style={styles.tripCard}
                                >
                                    <div style={styles.tripIcon}>🗺️</div>

                                    <h3>{trip.itineraryName}</h3>

                                    <p style={styles.date}>
                                        Travel date:{" "}
                                        {trip.travelDate || "Not selected"}
                                    </p>

                                    <p style={styles.date}>
                                        Places planned:{" "}
                                        {trip.ItineraryPlaces?.length || 0}
                                    </p>

                                    <div style={styles.actions}>
                                        <Link
                                            to={`/itinerary/${trip.itineraryId}`}
                                            style={styles.viewButton}
                                        >
                                            View Trip
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(trip.itineraryId)
                                            }
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
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
        flexWrap: "wrap",
        gap: "16px",
        padding: "22px 7%",
        background: "#fff",
        borderBottom: "1px solid #e8e8e0",
    },
    logo: {
        color: "#1f5135",
        fontSize: "21px",
        fontWeight: "bold",
        textDecoration: "none",
    },
    navLinks: {
        display: "flex",
        flexWrap: "wrap",
        gap: "22px",
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "55px 24px",
    },
    eyebrow: {
        color: "#1f7650",
        fontWeight: "bold",
        fontSize: "12px",
        letterSpacing: "3px",
    },
    heading: {
        fontSize: "42px",
        margin: "12px 0",
    },
    intro: {
        color: "#657166",
        lineHeight: 1.7,
        maxWidth: "650px",
    },
    form: {
        marginTop: "32px",
        maxWidth: "600px",
        padding: "28px",
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    },
    formHeading: {
        marginTop: 0,
        fontSize: "23px",
    },
    loginText: {
        color: "#657166",
        lineHeight: 1.7,
    },
    label: {
        display: "block",
        margin: "18px 0 8px",
        fontWeight: "bold",
    },
    input: {
        display: "block",
        width: "100%",
        padding: "13px",
        border: "1px solid #d9ded8",
        borderRadius: "7px",
        fontSize: "15px",
        boxSizing: "border-box",
    },
    button: {
        marginTop: "22px",
        padding: "13px 20px",
        background: "#1f5135",
        color: "#fff",
        border: 0,
        borderRadius: "7px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    tripSection: {
        marginTop: "45px",
    },
    listHeading: {
        fontSize: "27px",
    },
    tripGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    tripCard: {
        background: "#fff",
        border: "1px solid #e8e8e0",
        borderRadius: "12px",
        padding: "23px",
    },
    tripIcon: {
        fontSize: "30px",
    },
    date: {
        color: "#657166",
        fontSize: "14px",
    },
    actions: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "20px",
    },
    viewButton: {
        display: "inline-block",
        background: "#1f5135",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "14px",
    },
    deleteButton: {
        background: "#fff",
        border: "1px solid #c75b52",
        color: "#b42318",
        padding: "9px 14px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    empty: {
        padding: "25px",
        background: "#fff",
        borderRadius: "10px",
        color: "#657166",
    },
    success: {
        color: "#176b42",
        marginTop: "18px",
    },
    error: {
        color: "#b42318",
        marginTop: "18px",
    },
};

export default MyItinerary;
