import TouristMap from "../../components/Map/TouristMap";
import "./Map.css";

function Map() {
    return (
        <div className="map-page">

            <nav className="navbar">
                <div className="logo">
                    Kiriwawula TripMate
                </div>

                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/places">Places</a>
                    <a href="/map">Map</a>
                    <a href="/login">Login</a>
                    <a href="/signup" className="signup-btn">
                        Sign Up
                    </a>
                </div>
            </nav>

            <section className="map-page-header">
                <p>EXPLORE</p>

                <h1>Tourist Places Map</h1>

                <span>
                    Explore tourist attractions around
                    Kiriwawula and Kandy.
                </span>
            </section>

            <main className="map-page-container">
                <TouristMap />
            </main>

            <footer className="footer">
                <p>
                    © 2026 Kiriwawula TripMate.
                    All rights reserved.
                </p>
            </footer>

        </div>
    );
}

export default Map;