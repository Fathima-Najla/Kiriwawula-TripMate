import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

function MapFocus({ place }) {

    const map = useMap();

    useEffect(() => {

        if (place) {

            map.setView(
                [
                    parseFloat(place.latitude),
                    parseFloat(place.longitude)
                ],
                15
            );

        }

    }, [place, map]);

    return null;
}

function TouristMap() {

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [userLocation, setUserLocation] = useState(null);
    const [locationMessage, setLocationMessage] = useState("");

    const [searchParams] = useSearchParams();
    const selectedPlaceId = searchParams.get("placeId");

    const selectedPlace = places.find(
    (place) => String(place.placeId) === String(selectedPlaceId)
);

    useEffect(() => {

        fetch("http://localhost:8000/tourist-places")

            .then((response) => response.json())

            .then((data) => {

                console.log("MAP API DATA:", data);

                setPlaces(data.places);

                setLoading(false);

            })

            .catch((error) => {

                console.error(
                    "Error fetching map places:",
                    error
                );

                setLoading(false);

            });

    }, []);

        // NEW: Get the user's current location
    
            const getMyLocation = () => {
                if (!navigator.geolocation) {
                    setLocationMessage(
                        "Your browser does not support location."
                    );
                    return;
                }

                setLocationMessage("Finding your location...");

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        const accuracy = position.coords.accuracy;

                        setUserLocation({
                            latitude,
                            longitude
                        });

                        setLocationMessage(
                            `Location found. Accuracy: approximately ${Math.round(accuracy)} metres. Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        );
                    },
                    (error) => {
                        if (error.code === 1) {
                            setLocationMessage(
                                "Location permission denied. Allow location access in Chrome site settings."
                            );
                        } else if (error.code === 2) {
                            setLocationMessage(
                                "Location unavailable. Check your device location services or try a phone with GPS."
                            );
                        } else {
                            setLocationMessage(
                                "Location timed out. Try again with location services enabled."
                            );
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 20000,
                        maximumAge: 0
                    }
                );
            };



    return (
        <>

            {loading && (
                    <p>Loading tourist places on map...</p>
                )}

                {/* NEW: Current location button */}
                <div style={{ marginBottom: "12px" }}>
                    <button
                        type="button"
                        onClick={getMyLocation}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#1769aa",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        📍 Use My Current Location
                    </button>

                    {locationMessage && (
                        <p>{locationMessage}</p>
                    )}
                </div>

                    


            <MapContainer
                center={[7.2906, 80.6337]}
                zoom={11}
                style={{
                    height: "500px",
                    width: "100%"
                }}
            >
                {selectedPlace && (
                    <MapFocus place={selectedPlace} />
                )}


                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {places.map((place) => (

                    <Marker
                        key={place.placeId}
                        position={[
                            parseFloat(place.latitude),
                            parseFloat(place.longitude)
                        ]}
                        icon={defaultIcon}
                    >

                        
<Popup>
    <div style={{ minWidth: "190px" }}>
        <strong>{place.placeName}</strong>

        <p style={{ margin: "8px 0" }}>
            {place.location}
        </p>

        {userLocation ? (
    <>
        <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${place.latitude},${place.longitude}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "block",
                marginBottom: "8px",
                color: "#1769aa",
                fontWeight: "bold"
            }}
        >
            🚗 Get Driving Directions
        </a>

        <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${place.latitude},${place.longitude}&travelmode=walking`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "block",
                color: "#1769aa",
                fontWeight: "bold"
            }}
        >
            🚶 Get Walking Directions
        </a>
    </>
) : (
    <p>
        Click "Use My Current Location" first to get
        directions from your location.
    </p>
)}
    </div>
</Popup>


                    </Marker>

                ))}

            </MapContainer>

        </>
    );
}

export default TouristMap;