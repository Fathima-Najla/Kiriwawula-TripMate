import "./AdminCommon.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function ManagePlaces() {
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const page = document.querySelector(".manage-places-page");

    if (page) {
        page.scrollIntoView({
            behavior: "auto",
            block: "start",
        });
    }
};
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [facilities, setFacilities] = useState([]);
const [selectedFacilities, setSelectedFacilities] = useState([]);


    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        placeName: "",
        categoryId: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        entranceFee: "",
        openingTime: "",
        closingTime: "",
    });
    const [editingPlaceId, setEditingPlaceId] = useState(null);


const handleSavePlace = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const token = localStorage.getItem("token");

        const payload = {
            ...formData,
            categoryId: Number(formData.categoryId),
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            entranceFee:
                formData.entranceFee === ""
                    ? 0
                    : Number(formData.entranceFee),
                    facilityIds: selectedFacilities.map(Number),
        };
        

        const isEditing = editingPlaceId !== null;

        const response = await fetch(
            isEditing
                ? `http://localhost:8000/tourist-places/${editingPlaceId}`
                : "http://localhost:8000/tourist-places",
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to save tourist place."
            );
        }

        if (isEditing) {
            setPlaces((previousPlaces) =>
                previousPlaces.map((place) =>
                    place.placeId === editingPlaceId
                        ? { ...place, ...data.place }
                        : place
                )
            );
        } else {
            setPlaces((previousPlaces) => [
                ...previousPlaces,
                data.place,
            ]);
        }

        setFormData({
            placeName: "",
            categoryId: "",
            description: "",
            location: "",
            latitude: "",
            longitude: "",
            entranceFee: "",
            openingTime: "",
            closingTime: "",
        });

setEditingPlaceId(null);
setShowForm(false);

alert(
    isEditing
        ? "Tourist place updated successfully!"
        : "Tourist place added successfully!"
);

if (isEditing) {
    scrollToTop();
}
    } catch (err) {
        setError(err.message || "Unable to save tourist place.");
    }
};


const handleEditPlace = async (place) => {
    setEditingPlaceId(place.placeId);

    setFormData({
        placeName: place.placeName || "",
        categoryId: String(place.categoryId || ""),
        description: place.description || "",
        location: place.location || "",
        latitude: String(place.latitude ?? ""),
        longitude: String(place.longitude ?? ""),
        entranceFee: String(place.entranceFee ?? ""),
        openingTime: place.openingTime || "",
        closingTime: place.closingTime || "",
    });

    setSelectedFacilities([]);

    try {
        const response = await fetch(
            `http://localhost:8000/tourist-places/${place.placeId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to load assigned facilities.");
        }

        const placeDetails = data.place || data;
        const assignedFacilities =
            placeDetails.Facilities || placeDetails.Facility || [];

        setSelectedFacilities(
            assignedFacilities.map((facility) =>
                Number(facility.facilityId)
            )
        );
    } catch (error) {
        setError(error.message || "Failed to load assigned facilities.");
    }

    setShowForm(true);
};

const handleDeletePlace = async (placeId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this tourist place?"
    );

    if (!confirmed) return;

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:8000/tourist-places/${placeId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete tourist place.");
        }

        setPlaces((previousPlaces) =>
            previousPlaces.filter((place) => place.placeId !== placeId)
        );

        setError("");
alert("Tourist place deleted successfully!");
scrollToTop();


    } catch (err) {
        setError(err.message || "Unable to delete tourist place.");
    }
};

    // Load tourist places
useEffect(() => {
    const fetchPlaces = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/tourist-places"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load tourist places."
                );
            }

            setPlaces(data.places || []);
        } catch (err) {
            setError(err.message || "Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    fetchPlaces();
}, []);

// Load categories
useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/categories"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load categories."
                );
            }

            setCategories(data.categories || []);
        } catch (err) {
            setError(err.message || "Unable to load categories.");
        }
    };

    fetchCategories();
}, []);

useEffect(() => {
    async function fetchFacilities() {
        try {
            const response = await fetch(
                "http://localhost:8000/facilities"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load facilities.");
            }

            setFacilities(
                Array.isArray(data) ? data : data.facilities || []
            );
        } catch (err) {
            setError(err.message || "Unable to load facilities.");
        }
    }

    fetchFacilities();
}, []);



    return (
              <div className="manage-places-page">
                  <button onClick={() => navigate("/admin")}>
                      ← Back to Admin Dashboard
                  </button>

                  <div
          style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
          }}
      >
          <h1>Manage Tourist Places</h1>

          <button
              onClick={() => {
    setEditingPlaceId(null);
    setFormData({
        placeName: "",
        categoryId: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        entranceFee: "",
        openingTime: "",
        closingTime: "",
    });
    setSelectedFacilities([]);
    setShowForm(true);
}}
              style={{
                  padding: "12px 18px",
                  background: "#1f5135",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
              }}
          >
              + Add Tourist Place
          </button>
      </div>
            <p>View the tourist destinations stored in TripMate.</p>

            {showForm && (
    <form
        onSubmit={handleSavePlace}
        style={{
            marginTop: "20px",
            marginBottom: "25px",
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#f8f7f3",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
        }}
    >
        <h2 style={{ gridColumn: "1 / -1" }}>
            {editingPlaceId !== null
                ? "Edit Tourist Place"
                : "Add Tourist Place"}
        </h2>

        <input
            placeholder="Place name"
            value={formData.placeName}
            onChange={(e) =>
                setFormData({ ...formData, placeName: e.target.value })
            }
            required
        />

        <select
            value={formData.categoryId}
            onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
            }
            required
        >
            <option value="">Select category</option>
            {categories.map((category) => (
                <option
                    key={category.categoryId}
                    value={category.categoryId}
                >
                    {category.categoryName}
                </option>
            ))}
        </select>

            
<div
    style={{
        gridColumn: "1 / -1",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
    }}
>
    <h3>Available Facilities</h3>

    {facilities.length === 0 ? (
        <p>No facilities available. Add facilities first.</p>
    ) : (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
            }}
        >
            {facilities.map((facility) => (
                <label
                    key={facility.facilityId}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={selectedFacilities.includes(
                            facility.facilityId
                        )}
                        onChange={(e) => {
                            const id = facility.facilityId;

                            setSelectedFacilities((previous) =>
                                e.target.checked
                                    ? [...previous, id]
                                    : previous.filter(
                                          (selectedId) => selectedId !== id
                                      )
                            );
                        }}
                    />
                    {facility.facilityName}
                </label>
            ))}
        </div>
    )}
</div>


        <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
            }
            required
        />

        <input
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
            }
            required
        />

        <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
            }
            required
        />

        <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
            }
            required
        />

        <input
            type="number"
            min="0"
            step="any"
            placeholder="Entrance fee"
            value={formData.entranceFee}
            onChange={(e) =>
                setFormData({ ...formData, entranceFee: e.target.value })
            }
        />

        <label>
            Opening time
            <input
                type="time"
                value={formData.openingTime}
                onChange={(e) =>
                    setFormData({ ...formData, openingTime: e.target.value })
                }
            />
        </label>

        <label>
            Closing time
            <input
                type="time"
                value={formData.closingTime}
                onChange={(e) =>
                    setFormData({ ...formData, closingTime: e.target.value })
                }
            />
        </label>

        <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit">Save Tourist Place</button>

            <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ marginLeft: "10px" }}
            >
                Cancel
            </button>
        </div>
    </form>
)}


            {loading && <p>Loading tourist places...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={cellStyle}>ID</th>
                            <th style={cellStyle}>Place Name</th>
                            <th style={cellStyle}>Category</th>
                            <th style={cellStyle}>Location</th>
                            <th style={cellStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {places.map((place) => (
                            <tr key={place.placeId}>
                                <td style={cellStyle}>{place.placeId}</td>
                                <td style={cellStyle}>{place.placeName}</td>
                                <td style={cellStyle}>
                                    {place.Category?.categoryName || "—"}
                                </td>
                                <td style={cellStyle}>{place.location}</td>
                                <td style={cellStyle}>
                              <button
    onClick={async () => {
        await handleEditPlace(place);
        scrollToTop();
    }}
    style={{ marginRight: "8px" }}
>
    Edit
</button>

                              <button
                                  onClick={() => handleDeletePlace(place.placeId)}
                                  style={{
                                      background: "#b42318",
                                      color: "white",
                                      border: "none",
                                      padding: "6px 10px",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                  }}
                              >
                                  Delete
                              </button>
                          </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && !error && places.length === 0 && (
                <p>No tourist places found.</p>
            )}
        </div>
    );
}

const cellStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
};