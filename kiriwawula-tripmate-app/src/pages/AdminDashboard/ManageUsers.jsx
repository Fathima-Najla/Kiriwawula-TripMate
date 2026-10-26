import "./AdminCommon.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
    const navigate = useNavigate();

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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [saving, setSaving] = useState(false);

    async function requestUsers() {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8000/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load users.");
        }

        setUsers(Array.isArray(data) ? data : data.users || []);
    }

    useEffect(() => {
        async function loadUsers() {
            try {
                await requestUsers();
            } catch (err) {
                setError(err.message || "Unable to load users.");
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    function startEditing(user) {
        setMessage("");
        setError("");
        setEditingUser({
            userId: user.userId,
            fullName: user.fullName || "",
            email: user.email || "",
        });
    }

    async function saveUser(event) {
        event.preventDefault();

        if (!editingUser) return;

        setSaving(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `http://localhost:8000/users/${editingUser.userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        fullName: editingUser.fullName,
                        email: editingUser.email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update user.");
            }

            await requestUsers();
            setEditingUser(null);
            setMessage("User updated successfully.");
            scrollToTop();
        } catch (err) {
            setError(err.message || "Unable to update user.");
        } finally {
            setSaving(false);
        }
    }

    async function deleteUser(user) {
        const confirmed = window.confirm(
            `Delete the account for ${user.fullName}? This cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `http://localhost:8000/users/${user.userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete user.");
            }

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (item) => item.userId !== user.userId
                )
            );

            setMessage("User deleted successfully.");
            scrollToTop();
        } catch (err) {
            setError(err.message || "Unable to delete user.");
        }
    }

    const cellStyle = {
        border: "1px solid #ddd",
        padding: "10px",
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

            <h1>Manage Users</h1>
            <p>View, edit, and delete registered accounts.</p>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading users...</p>}

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
                            <th style={cellStyle}>User ID</th>
                            <th style={cellStyle}>Full Name</th>
                            <th style={cellStyle}>Email</th>
                            <th style={cellStyle}>Role</th>
                            <th style={cellStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userId}>
                                <td style={cellStyle}>{user.userId}</td>
                                <td style={cellStyle}>{user.fullName}</td>
                                <td style={cellStyle}>{user.email}</td>
                                <td style={cellStyle}>{user.role}</td>
                                <td style={cellStyle}>
                                    <button
                                    className="admin-edit-btn"
                                    type="button"
                                    onClick={() => {
                                    startEditing(user);
                                    scrollToTop();
                                }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="admin-delete-btn"
                                    type="button"
                                    onClick={() => deleteUser(user)}
                                >
                                    Delete
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && !error && users.length === 0 && (
                <p>No registered users found.</p>
            )}

            
{editingUser && (
    <form
        className="admin-form user-edit-form"
        onSubmit={saveUser}
    >
        <h2>Edit User #{editingUser.userId}</h2>

        <div className="user-form-field">
            <label htmlFor="editFullName">Full Name</label>
            <input
                id="editFullName"
                type="text"
                required
                value={editingUser.fullName}
                onChange={(event) =>
                    setEditingUser({
                        ...editingUser,
                        fullName: event.target.value,
                    })
                }
                placeholder="Enter full name"
            />
        </div>

        <div className="user-form-field">
            <label htmlFor="editEmail">Email Address</label>
            <input
                id="editEmail"
                type="email"
                required
                value={editingUser.email}
                onChange={(event) =>
                    setEditingUser({
                        ...editingUser,
                        email: event.target.value,
                    })
                }
                placeholder="Enter email address"
            />
        </div>

        <div className="user-form-actions">
            <button
                className="admin-primary-btn"
                type="submit"
                disabled={saving}
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
                className="admin-cancel-btn"
                type="button"
                onClick={() => setEditingUser(null)}
                disabled={saving}
            >
                Cancel
            </button>
        </div>
    </form>
)}

        </div>
    );
}
