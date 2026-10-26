
import "./AdminCommon.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/facilities";

export default function ManageFacilities() {
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

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [facilityName, setFacilityName] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingFacilityId, setEditingFacilityId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const getToken = () => localStorage.getItem("token");

    // Load facilities
    async function fetchFacilities() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load facilities."
                );
            }

            setFacilities(
                Array.isArray(data) ? data : data.facilities || []
            );
        } catch (err) {
            setError(err.message || "Unable to load facilities.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFacilities();
    }, []);

    // Open form for adding a facility
    const handleAdd = () => {
        setEditingFacilityId(null);
        setFacilityName("");
        setError("");
        setShowForm(true);
    };

    // Open form for editing a facility
    const handleEdit = (facility) => {
        setEditingFacilityId(
            facility.facilityId ?? facility.id
        );
        setFacilityName(facility.facilityName || facility.name || "");
        setError("");
        setShowForm(true);
    };

    // Add or update facility
    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = facilityName.trim();

        if (!trimmedName) {
            setError("Please enter a facility name.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const token = getToken();

            if (!token) {
                throw new Error("Please log in again.");
            }

            const isEditing = editingFacilityId !== null;

            const url = isEditing
                ? `${API_URL}/${editingFacilityId}`
                : API_URL;

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    facilityName: trimmedName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isEditing
                        ? "Failed to update facility."
                        : "Failed to add facility.")
                );
            }

            setShowForm(false);
setFacilityName("");
setEditingFacilityId(null);

await fetchFacilities();

if (isEditing) {
    scrollToTop();
}

        } catch (err) {
            setError(err.message || "Unable to save facility.");
        } finally {
            setSaving(false);
        }
    };

    // Delete facility
    const handleDelete = async (facility) => {
        const id = facility.facilityId ?? facility.id;
        const name = facility.facilityName || facility.name || "this facility";

        if (id == null) {
            setError("Cannot delete: facility ID is missing.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${name}"?`
        );

        if (!confirmed) return;

        setDeletingId(id);
        setError("");

        try {
            const token = getToken();

            if (!token) {
                throw new Error("Please log in again.");
            }

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete facility."
                );
            }

            setFacilities((previous) =>
                previous.filter(
                    (item) =>
                        (item.facilityId ?? item.id) !== id
                )
            );

            scrollToTop();

            if (editingFacilityId === id) {
                setShowForm(false);
                setEditingFacilityId(null);
                setFacilityName("");
            }
        } catch (err) {
            setError(err.message || "Unable to delete facility.");
        } finally {
            setDeletingId(null);
        }
    };

    const cellStyle = {
        border: "1px solid #ddd",
        padding: "12px",
        textAlign: "left",
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
                    <h1>Manage Facilities</h1>
                    <p>
                        Add, edit, and delete facilities associated
                        with tourist destinations.
                    </p>
                </div>

                <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={handleAdd}
                >
                    + Add Facility
                </button>
            </div>

            {showForm && (
                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingFacilityId !== null
                            ? "Edit Facility"
                            : "Add New Facility"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Enter facility name"
                        value={facilityName}
                        onChange={(e) =>
                            setFacilityName(e.target.value)
                        }
                        required
                    />

                    <div>
                        <button
                            className="admin-primary-btn"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingFacilityId !== null
                                ? "Update Facility"
                                : "Save Facility"}
                        </button>

                        <button
                            className="admin-cancel-btn"
                            type="button"
                            disabled={saving}
                            onClick={() => {
                                setShowForm(false);
                                setEditingFacilityId(null);
                                setFacilityName("");
                                setError("");
                            }}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {error && (
                <p style={{ color: "red", marginTop: "15px" }}>
                    {error}
                </p>
            )}

            {loading ? (
                <p>Loading facilities...</p>
            ) : (
                <>
                    {facilities.length > 0 ? (
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
                                    <th style={cellStyle}>
                                        Facility Name
                                    </th>
                                    <th style={cellStyle}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {facilities.map((facility, index) => {
                                    const id =
                                        facility.facilityId ??
                                        facility.id;

                                    return (
                                        <tr key={id ?? index}>
                                            <td style={cellStyle}>
                                                {id ?? "-"}
                                            </td>

                                            <td style={cellStyle}>
                                                {facility.facilityName ||
                                                    facility.name ||
                                                    "-"}
                                            </td>

                                            
<td style={cellStyle}>
    <button
        className="admin-edit-btn"
        type="button"
        onClick={() => {
    handleEdit(facility);
    scrollToTop();
}}
    >
        Edit
    </button>

    <button
        className="admin-delete-btn"
        type="button"
        disabled={deletingId === id}
        onClick={() => handleDelete(facility)}
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
                        <p>No facilities found.</p>
                    )}
                </>
            )}
        </div>
    );
}
