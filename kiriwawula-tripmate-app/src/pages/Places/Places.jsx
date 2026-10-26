
import { useEffect, useState } from "react";
import "./Places.css";
import TouristMap from "../../components/Map/TouristMap";

function Places() {
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    
const suggestions = searchTerm.trim()
    ? places
          .filter((place) => {
              const matchesSearch = place.placeName
                  ?.toLowerCase()
                  .includes(searchTerm.trim().toLowerCase());

              const matchesCategory =
                  category === "All" ||
                  place.Category?.categoryName === category;

              return matchesSearch && matchesCategory;
          })
          .slice(0, 5)
    : [];


    useEffect(() => {
        fetch("http://localhost:8000/tourist-places")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch tourist places");
                }
                return response.json();
            })
            .then((data) => {
                console.log("API DATA:", data);
                setPlaces(data.places || []);
            })
            .catch((error) => {
                console.error("Error fetching tourist places:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredPlaces = places.filter((place) => {

        const suggestions = searchTerm.trim()
    ? places
          .filter((place) => {
              const matchesSearch = place.placeName
                  ?.toLowerCase()
                  .includes(searchTerm.trim().toLowerCase());

              const matchesCategory =
                  category === "All" ||
                  place.Category?.categoryName === category;

              return matchesSearch && matchesCategory;
          })
          .slice(0, 5)
    : [];

        const matchesSearch =
            place.placeName &&
            place.placeName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesCategory =
            category === "All" ||
            place.Category?.categoryName === category;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="places-page">

            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">
                    Kiriwawula TripMate
                </div>

                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/places">Places</a>
                    <a href="/login">Login</a>
                    <a href="/signup" className="signup-btn">
                        Sign Up
                    </a>
                </div>
            </nav>

            {/* Page Header */}
            <section className="places-header">
                <p>DISCOVER</p>

                <h1>Explore Tourist Places</h1>

                <p>
                    Discover beautiful historical, religious and
                    natural attractions around Kiriwawula and Kandy.
                </p>
            </section>

            {/* Search and Filter */}
            <section className="search-section">
                
<div className="search-box">
    <span>🔍</span>

    <input
        type="text"
        placeholder="Search tourist places..."
        value={searchTerm}
        autoComplete="off"
        onChange={(e) => setSearchTerm(e.target.value)}
    />

    {suggestions.length > 0 && (
        <div className="search-suggestions">
            {suggestions.map((place) => (
                <button
                    key={place.placeId}
                    type="button"
                    className="search-suggestion-item"
                    onClick={() => setSearchTerm(place.placeName)}
                >
                    <span>📍</span>
                    <span>{place.placeName}</span>
                </button>
            ))}
        </div>
    )}
</div>


                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Historical & Cultural">
                        Historical & Cultural
                    </option>
                    <option value="Religious">Religious</option>
                    <option value="Nature & Wildlife">
                        Nature & Wildlife
                    </option>
                    <option value="Scenic">Scenic</option>
                    <option value="Adventure">Adventure</option>
                </select>
            </section>

            {/* Tourist Places */}
            <section className="places-container">
                {loading ? (
                    <p>Loading tourist places...</p>
                ) : filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place) => (
                        <div
                            className="place-card"
                            key={place.placeId}
                        >
                            <div className="place-image">
                                <img
                                    src={`/images/${place.placeName}.jpg`}
                                    alt={place.placeName}
                                />
                            </div>

                            <div className="place-content">
                                <span className="place-category">
                                    {place.Category?.categoryName}
                                </span>

                                <h2>{place.placeName}</h2>

                                <p>{place.description}</p>

                                <a
                                    href={`/places/${place.placeId}`}
                                    className="details-btn"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <h2>No tourist places found</h2>
                        <p>
                            Try a different search or category.
                        </p>
                    </div>
                )}
            </section>

            {/* Map */}
            <section className="map-section">
                <div className="map-heading">
                    <p>MAP</p>
                    <h2>Explore Places on the Map</h2>
                    <span>
                        Find tourist attractions around Kiriwawula and Kandy.
                    </span>
                </div>

                <TouristMap />
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>
                    © 2026 Kiriwawula TripMate. All rights reserved.
                </p>
            </footer>

        </div>
    );
}

export default Places;