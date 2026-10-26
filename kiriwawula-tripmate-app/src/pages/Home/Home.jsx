import "./Home.css";

function Home() {
    return (
        <div className="home-page">

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

            {/* Hero Section */}
            <section className="hero">

                <div className="hero-content">
                    <p className="hero-small">
                        DISCOVER • PLAN • EXPLORE
                    </p>

                    <h1>
                        Explore Kiriwawula
                        <br />
                        & Kandy
                    </h1>

                    <p className="hero-description">
                        Plan your perfect day trip around Kiriwawula
                        and Kandy. Discover beautiful places, create
                        your itinerary, and enjoy your journey.
                    </p>

                    <div className="hero-buttons">
                        <a href="/places" className="primary-btn">
                            Explore Places
                        </a>

                        <a href={localStorage.getItem("token") ? "/itinerary" : "/login"}
                        className="secondary-btn">
                            Plan Your Trip
                        </a>
                    </div>
                </div>

            </section>

            {/* Popular Places */}
            <section className="popular-section">

                <p className="section-small">
                    DISCOVER KANDY
                </p>

                <h2>Popular Tourist Places</h2>

                <p className="section-description">
                    Discover historical, religious and natural
                    attractions around Kiriwawula and Kandy.
                </p>

                <div className="place-cards">

                    <div className="place-card">
                        <div className="place-image">
                        <img
                            src="/images/Gadaladeniya Raja Maha Viharaya.jpg"
                            alt="Gadaladeniya Raja Maha Viharaya"
                        />
                    </div>

                        <h3>Gadaladeniya Raja Maha Viharaya</h3>

                        <p>
                            Explore this ancient Buddhist temple
                            and its historic architecture.
                        </p>
                    </div>

                    <div className="place-card">
                        <div className="place-image">
                        <img
                            src="/images/Royal Botanic Gardens Peradeniya.jpg"
                            alt="Royal Botanic Gardens"
                        />
                    </div>

                        <h3>Royal Botanic Gardens</h3>

                        <p>
                            Enjoy beautiful gardens and nature
                            in Peradeniya.
                        </p>
                    </div>

                    <div className="place-card">
                        <div className="place-image">
                        <img
                            src="/images/Nelligala International Buddhist Centre.jpg"
                            alt="Nelligala International Centre"
                        />
                    </div>

                        <h3>Nelligala International Centre</h3>

                        <p>
                            Experience scenic views and a peaceful
                            environment.
                        </p>
                    </div>

                </div>

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

export default Home;   