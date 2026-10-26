import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PlaceDetails.css";

function PlaceDetails() {

    const { placeId } = useParams();
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);
    const [media, setMedia] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addedItineraryId, setAddedItineraryId] = useState(null);

    const handleAddToItinerary = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please log in before adding a place to your itinerary.");
            navigate("/login");
            return;
        }

        // Load the logged-in user's itineraries
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
            throw new Error(data.message || "Unable to load your itineraries.");
        }

        const itineraries = data.itineraries || [];

        if (itineraries.length === 0) {
            alert("You don't have an itinerary yet. Please create one first.");
            navigate("/dashboard");
            return;
        }

        // Use the first itinerary returned by the API
        const itinerary = itineraries[0];

        const addResponse = await fetch(
            "http://localhost:8000/itinerary-places",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    itineraryId: itinerary.itineraryId,
                    placeId: Number(placeId),
                    visitOrder: 1
                })
            }
        );

        const addData = await addResponse.json();

        if (!addResponse.ok) {
            throw new Error(addData.message || "Unable to add this place.");
        }

        setAddedItineraryId(itinerary.itineraryId);
    } catch (error) {
        console.error("Add to itinerary error:", error);
        alert(error.message || "Something went wrong.");
    }
};


    useEffect(() => {

    setLoading(true);

    Promise.all([
    fetch(`http://localhost:8000/tourist-places/${placeId}`),
    fetch(`http://localhost:8000/media`),
    placeId === "9"
        ? fetch("http://localhost:8000/tourist-places/9/attractions")
        : Promise.resolve(null)
    ])
        .then(async ([placeResponse, mediaResponse, attractionsResponse]) => {

            if (!placeResponse.ok) {
                throw new Error("Tourist place not found");
            }

            const placeData = await placeResponse.json();
            const mediaData = await mediaResponse.json();

            if (attractionsResponse) {
                const attractionsData = await attractionsResponse.json();
                setAttractions(attractionsData.attractions || []);
            } else {
                setAttractions([]);
            }

            console.log("PLACE DETAILS API DATA:", placeData);
            console.log("MEDIA API DATA:", mediaData);

            setPlace(placeData.place);

            const placeMedia = mediaData.media.filter(
                (item) =>
                    String(item.placeId) === String(placeId)
            );

            setMedia(placeMedia);

            setLoading(false);
        })
        .catch((error) => {

            console.error(
                "Error fetching place details:",
                error
            );

            setError(error.message);
            setLoading(false);
        });

}, [placeId]);


    // Loading
    if (loading) {
        return (
            <div className="not-found">
                <h1>Loading...</h1>
                <p>
                    Loading tourist place details...
                </p>
            </div>
        );
    }


    // Error / Place not found
    if (error || !place) {
        return (
            <div className="not-found">

                <h1>Place Not Found</h1>

                <p>
                    The tourist place you are looking for does not exist.
                </p>

                <a href="/places">
                    Back to Places
                </a>

            </div>
        );
    }

        const images = media.filter(
        (item) => item.mediaType === "image"
    );

    return (
        <div className="place-details-page">

            <nav className="navbar">

                <div className="logo">
                    Kiriwawula TripMate
                </div>

                <div className="nav-links">

                    <a href="/">
                        Home
                    </a>

                    <a href="/places">
                        Places
                    </a>

                    <a href="/login">
                        Login
                    </a>

                    <a
                        href="/signup"
                        className="signup-btn"
                    >
                        Sign Up
                    </a>

                </div>

            </nav>


            <section className="details-header">

                <p>
                    {place.Category?.categoryName}
                </p>

                <h1>
                    {place.placeName}
                </h1>

                <span>
                    📍 {place.location}
                </span>

            </section>


            <main className="details-container">

  <div className="details-media">

    {/* Image Gallery */}
    <div className="image-gallery">
        {media
            .filter((item) => item.mediaType === "image")
            .map((item) => (
               <img
                    key={item.mediaId}
                    src={`http://localhost:8000${item.mediaUrl}`}
                    alt={place.placeName}
                    onClick={() => {
                        const index = images.findIndex(
                            (image) => image.mediaId === item.mediaId
                        );

                        setSelectedImageIndex(index);
                        setSelectedImage(
                            `http://localhost:8000${item.mediaUrl}`
                        );
                    }}
                />
            ))}
    </div>

   {selectedImage && (
    <div
        className="image-modal"
        onClick={() => setSelectedImage(null)}
    >

        <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
        >

            <button
                className="close-modal"
                onClick={() => setSelectedImage(null)}
            >
                ✕
            </button>

            <button
                className="gallery-arrow left-arrow"
                onClick={() => {
                    const newIndex =
                        (selectedImageIndex - 1 + images.length) %
                        images.length;

                    setSelectedImageIndex(newIndex);
                    setSelectedImage(
                        `http://localhost:8000${images[newIndex].mediaUrl}`
                    );
                }}
            >
                ❮
            </button>

            <img
                src={selectedImage}
                alt={place.placeName}
            />

            <button
                className="gallery-arrow right-arrow"
                onClick={() => {
                    const newIndex =
                        (selectedImageIndex + 1) %
                        images.length;

                    setSelectedImageIndex(newIndex);
                    setSelectedImage(
                        `http://localhost:8000${images[newIndex].mediaUrl}`
                    );
                }}
            >
                ❯
            </button>

        </div>

    </div>
)}

    {/* Video */}
    {media
        .filter((item) => item.mediaType === "video")
        .map((item) => (
            <video
                key={item.mediaId}
                controls
                className="place-video"
            >
                <source
                    src={`http://localhost:8000${item.mediaUrl}`}
                    type="video/mp4"
                />
                Your browser does not support video playback.
            </video>
        ))}

</div>


                <div className="details-content">

                    <h2>
                        About This Place
                    </h2>

                    <p>
                        {place.description}
                    </p>


                    {String(placeId) === "9" && (
                        <section className="attractions-section">
                            <h2>Explore Attractions Inside Ambuluwawa</h2>

                            <div className="attractions-list">
                                {attractions.map((attraction) => {
                                    const hasCoordinates =
                                        attraction.latitude !== null &&
                                        attraction.longitude !== null;

                                    const navigationUrl = hasCoordinates
                                        ? `https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`
                                        : null;

                                    return (
                                        <div
                                            className="attraction-card"
                                            key={attraction.attractionId}
                                        >
                                            <h3>{attraction.attractionName}</h3>

                                            <p>{attraction.description}</p>

                                            {hasCoordinates ? (
                                                <a
                                                    href={navigationUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="attraction-navigation-btn"
                                                >
                                                    Get Directions
                                                </a>
                                            ) : (
                                                <p className="coordinates-pending">
                                                    Navigation location not available yet
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <div className="info-grid">

                        <div className="info-box">

                            <span>
                                💰
                            </span>

                            <strong>
                                Entrance Fee
                            </strong>

                            <p>
                                {Number(place.entranceFee) === 0
                                    ? "Free"
                                    : `LKR ${place.entranceFee}`}
                            </p>

                        </div>


                        <div className="info-box">

                            <span>
                                🕐
                            </span>

                            <strong>
                                Opening Hours
                            </strong>

                            <p>
                                {place.openingTime} - {place.closingTime}
                            </p>

                        </div>

                    </div>


                    <h2>
                        Facilities
                    </h2>

                    <div className="facilities">

                        {place.Facilities && place.Facilities.length > 0 ? (

                            place.Facilities.map((facility) => (

                                <span key={facility.facilityId}>
                                    ✓ {facility.facilityName}
                                </span>

                            ))

                        ) : (

                            <span>
                                No facilities available
                            </span>

                        )}

                    </div>

                    {addedItineraryId && (
                            <div className="itinerary-success">
                                <h3>✓ Place added successfully!</h3>
                                <p>
                                    {place.placeName} has been added to your itinerary.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(`/itinerary/${addedItineraryId}`)
                                    }
                                >
                                    View My Itinerary
                                </button>

                                <button onClick={() => navigate("/places")}>
                                    Explore More Places
                                </button>
                            </div>
                        )}


                    <div className="details-buttons">

                       <button
                            className="itinerary-btn"
                            onClick={handleAddToItinerary}
                        >
                            Add to My Itinerary
                        </button>

                        <button
                        className="map-btn"
                        onClick={() => navigate(`/map?placeId=${placeId}`)}
                    >
                        View on Map
                    </button>
<button
    type="button"
    className="create-itinerary-btn"
    onClick={() =>
        navigate("/itinerary", {
            state: {
                placeId: Number(placeId),
                placeName: place.placeName,
            },
        })
    }
>
    Create Itinerary
</button>

                    </div>

                </div>

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

export default PlaceDetails;
