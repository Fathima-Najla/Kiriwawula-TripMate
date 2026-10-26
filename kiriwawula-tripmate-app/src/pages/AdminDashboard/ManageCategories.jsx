
import "./AdminCommon.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/categories";

export default function ManageCategories() {
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

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    async function fetchCategories() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load categories."
                );
            }

            setCategories(
                Array.isArray(data) ? data : data.categories || []
            );
        } catch (err) {
            setError(err.message || "Unable to load categories.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setEditingCategoryId(null);
        setCategoryName("");
        setError("");
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setEditingCategoryId(category.categoryId);
        setCategoryName(category.categoryName || "");
        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = categoryName.trim();

        if (!trimmedName) {
            setError("Please enter a category name.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in again.");
            }

            const isEditing = editingCategoryId !== null;

            const response = await fetch(
                isEditing
                    ? `${API_URL}/${editingCategoryId}`
                    : API_URL,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        categoryName: trimmedName,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save category."
                );
            }

           setShowForm(false);
            setCategoryName("");
            setEditingCategoryId(null);

            await fetchCategories();

            if (isEditing) {
                scrollToTop();
            }

        } catch (err) {
            setError(err.message || "Unable to save category.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        const id = category.categoryId;

        if (id == null) {
            setError("Cannot delete category: category ID is missing.");
            return;
        }

        if (
            !window.confirm(
                `Are you sure you want to delete "${category.categoryName}"?`
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

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));

                throw new Error(
                    data.message || "Failed to delete category."
                );
            }

            setCategories((previous) =>
                previous.filter((item) => item.categoryId !== id)
            );
            scrollToTop();

            if (editingCategoryId === id) {
                setShowForm(false);
                setEditingCategoryId(null);
                setCategoryName("");
            }
        } catch (err) {
            setError(err.message || "Unable to delete category.");
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
                    <h1>Manage Categories</h1>
                    <p>
                        Add, edit, and delete categories used to
                        organize tourist places.
                    </p>
                </div>

                <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={handleAdd}
                >
                    + Add Category
                </button>
            </div>

            {showForm && (
                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingCategoryId !== null
                            ? "Edit Category"
                            : "Add New Category"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) =>
                            setCategoryName(e.target.value)
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
                            : editingCategoryId !== null
                            ? "Update Category"
                            : "Save Category"}
                    </button>

                    <button
                        className="admin-cancel-btn"
                        type="button"
                        disabled={saving}
                        onClick={() => {
                            setShowForm(false);
                            setEditingCategoryId(null);
                            setCategoryName("");
                            setError("");
                        }}
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
                <p>Loading categories...</p>
            ) : categories.length > 0 ? (
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
                            <th style={cellStyle}>Category Name</th>
                            <th style={cellStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.categoryId}>
                                <td style={cellStyle}>
                                    {category.categoryId}
                                </td>

                                <td style={cellStyle}>
                                    {category.categoryName}
                                </td>

                            
<td style={cellStyle}>
    <button
        className="admin-edit-btn"
        type="button"
        onClick={() => {
    handleEdit(category);
    scrollToTop();
}}
    >
        Edit
    </button>

    <button
        className="admin-delete-btn"
        type="button"
        disabled={deletingId === category.categoryId}
        onClick={() => handleDelete(category)}
    >
        {deletingId === category.categoryId
            ? "Deleting..."
            : "Delete"}
    </button>
</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No categories found.</p>
            )}
        </div>
    );
}
