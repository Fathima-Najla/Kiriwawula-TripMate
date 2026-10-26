
import "./ManagePlaces.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/media";

// Read JSON safely and display useful errors if the backend returns HTML.
async function readApiResponse(response) {
    const text = await response.text();

    let data;

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(
            `Backend returned HTML or invalid JSON (HTTP ${response.status}). ` +
            `Check the media API route. Response: ${text.slice(0, 150)}`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed (HTTP ${response.status}).`
        );
    }

    return data;
}

export default function ManageMedia() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        const page = document.querySelector(".admin-manage-page");

        if (page) {
            page.scrollIntoView({
                behavior: "auto",
                block: "start",
            });
        }
    };

    const navigate = useNavigate();

    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingMediaId, setEditingMediaId] = useState(null);
    const [mediaType, setMediaType] = useState("image");
    const [mediaUrl, setMediaUrl] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Load all media records
    async function fetchMedia() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await readApiResponse(response);

            setMedia(
                Array.isArray(data) ? data : data.media || []
            );
        } catch (err) {
            setError(err.message || "Unable to load media.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMedia();
    }, []);

    // Reset the form
    const resetForm = () => {
        setShowForm(false);
        setEditingMediaId(null);
        setMediaType("image");
        setMediaUrl("");
        setPlaceId("");
        setError("");
    };

    // Open the add form
    const handleAdd = () => {
        resetForm();
        setShowForm(true);
    };

    // Load selected media into the edit form
    const handleEdit = (item) => {
        setEditingMediaId(item.mediaId ?? item.id);
        setMediaType(item.mediaType || item.type || "image");
        setMediaUrl(item.mediaUrl || item.url || "");
        setPlaceId(String(item.placeId ?? ""));
        setError("");
        setShowForm(true);
    };

    // Add or update media
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mediaUrl.trim() || !placeId.trim()) {
            setError("Please enter the media URL and place ID.");
            return;
        }

        const id = editingMediaId;
        const isEditing = id !== null;

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in again.");
            }

            const response = await fetch(
                isEditing ? `${API_URL}/${id}` : API_URL,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        mediaType,
                        mediaUrl: mediaUrl.trim(),
                        placeId: Number(placeId),
                    }),
                }
            );

            // Use the safe response helper instead of response.json()
            await readApiResponse(response);
resetForm();
await fetchMedia();

if (isEditing) {
    scrollToTop();
}

        } catch (err) {
            setError(err.message || "Unable to save media.");
        } finally {
            setSaving(false);
        }
    };

    // Delete media
    const handleDelete = async (item) => {
        const id = item.mediaId ?? item.id;

        if (id == null) {
            setError("Cannot delete media: media ID is missing.");
            return;
        }

        if (
            !window.confirm(
                "Are you sure you want to delete this media record?"
            )
        ) {
            return;
        }

        setDeletingId(id);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in again.");
            }

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Handles JSON responses and empty successful responses
            await readApiResponse(response);

            setMedia((previous) =>
                previous.filter(
                    (entry) => (entry.mediaId ?? entry.id) !== id
                )
            );

            scrollToTop();

            if (editingMediaId === id) {
                resetForm();
            }
        } catch (err) {
            setError(err.message || "Unable to delete media.");
        } finally {
            setDeletingId(null);
        }
    };

    const cellStyle = {
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "left",
        overflowWrap: "anywhere",
    };

    return (
        <div className="admin-manage-page">
            <button
            className="back-admin-btn"
            type="button"
            onClick={() => navigate("/admin")}
        >
            ← Back to Admin Dashboard
        </button>

            <div className="admin-manage-header">
                <div>
                    <h1>Manage Media</h1>
                    <p>
                        Add, edit, and delete photos and videos
                        associated with tourist places.
                    </p>
                </div>

                <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={handleAdd}
                >
                    + Add Media
                </button>
            </div>

            {showForm && (
                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingMediaId !== null
                            ? "Edit Media"
                            : "Add New Media"}
                    </h2>

                    <label>Media Type</label>
                    <select
                        value={mediaType}
                        onChange={(e) =>
                            setMediaType(e.target.value)
                        }
                        required
                    >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>

                    <label>Media URL</label>
                    <input
                        type="text"
                        placeholder="Enter media URL or file path"
                        value={mediaUrl}
                        onChange={(e) =>
                            setMediaUrl(e.target.value)
                        }
                        required
                    />

                    <label>Place ID</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Enter associated place ID"
                        value={placeId}
                        onChange={(e) =>
                            setPlaceId(e.target.value)
                        }
                        required
                    />

                    <button
                        className="admin-primary-btn"
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingMediaId !== null
                            ? "Update Media"
                            : "Save Media"}
                    </button>

                    <button
                        className="admin-cancel-btn"
                        type="button"
                        disabled={saving}
                        onClick={resetForm}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                </form>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {loading ? (
                <p>Loading media...</p>
            ) : media.length > 0 ? (
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
                            <th style={cellStyle}>Media Type</th>
                            <th style={cellStyle}>Media URL</th>
                            <th style={cellStyle}>Place ID</th>
                            <th style={cellStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {media.map((item, index) => {
                            const id = item.mediaId ?? item.id;

                            return (
                                <tr key={id ?? index}>
                                    <td style={cellStyle}>
                                        {id ?? "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.mediaType || item.type || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.mediaUrl || item.url || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.placeId ?? "-"}
                                    </td>


                                <td style={cellStyle}>
                                    <button
                                        className="admin-edit-btn"
                                        type="button"
                                        onClick={() => {
    handleEdit(item);
    scrollToTop();
}}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="admin-delete-btn"
                                        type="button"
                                        disabled={deletingId === id}
                                        onClick={() => handleDelete(item)}
                                    >
                                        {deletingId === id ? "Deleting..." : "Delete"}
                                    </button>
                                </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No media records found.</p>
            )}
        </div>
    );
}
