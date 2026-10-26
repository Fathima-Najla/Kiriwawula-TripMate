
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [isVerifying, setIsVerifying] = useState(true);
    const [stats, setStats] = useState({
    places: 0,
    categories: 0,
    facilities: 0,
    media: 0,
    users: 0,
});

const [statsLoading, setStatsLoading] = useState(true);
const [statsError, setStatsError] = useState("");

useEffect(() => {
    const verifyAdmin = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/admin/verify",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 403) {
                navigate("/dashboard", { replace: true });
                return;
            }

            if (!response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login", { replace: true });
                return;
            }
        } catch (error) {
            console.error("Admin verification failed:", error);
        } finally {
            setIsVerifying(false);
        }
    };

    verifyAdmin();
}, [navigate]);

    useEffect(() => {
    let cancelled = false;

    async function loadStats() {
        try {
            const token = localStorage.getItem("token");

            const [placesRes, categoriesRes, facilitiesRes, mediaRes, usersRes] =
                await Promise.all([
                    fetch("http://localhost:8000/tourist-places"),
                    fetch("http://localhost:8000/categories"),
                    fetch("http://localhost:8000/facilities"),
                    fetch("http://localhost:8000/media"),
                    fetch("http://localhost:8000/users", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);

            const responses = [
                placesRes,
                categoriesRes,
                facilitiesRes,
                mediaRes,
                usersRes,
            ];

            if (responses.some((response) => !response.ok)) {
                throw new Error(
                    "Some dashboard counts could not be loaded. Please log in again if your session expired."
                );
            }

            const [placesData, categoriesData, facilitiesData, mediaData, usersData] =
                await Promise.all(
                    responses.map((response) => response.json())
                );

            if (cancelled) return;

            setStats({
                places: (placesData.places || []).length,
                categories: (categoriesData.categories || []).length,
                facilities: (facilitiesData.facilities || []).length,
                media: (mediaData.media || []).length,
                users: (usersData.users || []).length,
            });
        } catch (error) {
            if (!cancelled) {
                setStatsError(error.message || "Unable to load dashboard counts.");
            }
        } finally {
            if (!cancelled) {
                setStatsLoading(false);
            }
        }
    }

    loadStats();

    return () => {
        cancelled = true;
    };
}, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const sections = [
        {
            icon: "📍",
            title: "Tourist Places",
            description: "Manage destinations and place information.",
            action: "Manage Places",
            path: "/admin/places"
        },
        {
            icon: "🗂️",
            title: "Categories",
            description: "Organize tourist places into categories.",
            action: "Manage Categories",
            path: "/admin/categories",
        },
        {
            icon: "🏞️",
            title: "Facilities",
            description: "Maintain facilities available at each place.",
            action: "Manage Facilities",
            path: "/admin/facilities",
        },
        {
            icon: "🖼️",
            title: "Media",
            description: "Manage photos and videos of destinations.",
            action: "Manage Media",
            path: "/admin/media",
        },
        {
            icon: "👥",
            title: "Users",
            description: "View and manage registered accounts.",
            action: "Manage Users",
            path: "/admin/users",
        },
    ];

    if (isVerifying) {
    return <p>Verifying admin access...</p>;
}

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-brand">
                    Kiriwawula
                    <span>TripMate</span>
                </h2>

                <p className="admin-menu-label">ADMIN MENU</p>

                {/* <button
                    className="admin-nav active"
                    onClick={() => navigate("/admin")}
                >
                    ◫ Overview
                </button>

                <button
                    className="admin-nav"
                    onClick={() => navigate("/places")}
                >
                    📍 Tourist Places
                </button> */}

                
<button
    className="admin-nav active"
    onClick={() => navigate("/admin")}
>
    ◫ Overview
</button>

<button
    className="admin-nav"
    onClick={() => navigate("/admin/places")}
>
    📍 Tourist Places
</button>

<button
    className="admin-nav"
    onClick={() => navigate("/admin/categories")}
>
    🗂️ Categories
</button>

<button
    className="admin-nav"
    onClick={() => navigate("/admin/facilities")}
>
    🏞️ Facilities
</button>

<button
    className="admin-nav"
    onClick={() => navigate("/admin/media")}
>
    🖼️ Media
</button>

<button
    className="admin-nav"
    onClick={() => navigate("/admin/users")}
>
    👥 Users
</button>


                <button
                    className="admin-nav"
                    onClick={() => navigate("/")}
                >
                    🏠 View Website
                </button>

                <button
                    className="admin-nav admin-logout"
                    onClick={handleLogout}
                >
                    ↪ Logout
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <p className="admin-eyebrow">
                            ADMINISTRATION
                        </p>
                        <h1>Admin Dashboard</h1>
                        <p>
                            Manage your Kiriwawula TripMate system.
                        </p>
                    </div>

                    <button
                        className="admin-view-button"
                        onClick={() => navigate("/")}
                    >
                        View Website ↗
                    </button>
                </header>

                <section className="admin-welcome">
                    <div>
                        <h2>Welcome, Administrator!</h2>
                        <p>
                          Keep destination information organized and help visitors
                          discover places around Kiriwawula and Kandy.
                      </p>
                    </div>
                    <span className="admin-welcome-icon">🌿</span>
                </section>
                
<section className="admin-stats">
    {[
        {
            label: "Tourist Places",
            count: stats.places,
            icon: "📍",
            color: "places",
            path: "/admin/places",
        },
        {
            label: "Categories",
            count: stats.categories,
            icon: "🗂️",
            color: "categories",
            path: "/admin/categories",
        },
        {
            label: "Facilities",
            count: stats.facilities,
            icon: "🏞️",
            color: "facilities",
            path: "/admin/facilities",
        },
        {
            label: "Media Items",
            count: stats.media,
            icon: "🖼️",
            color: "media",
            path: "/admin/media",
        },
        {
            label: "Registered Users",
            count: stats.users,
            icon: "👥",
            color: "users",
            path: "/admin/users",
        },
    ].map((item) => (
        <button
            className="admin-stat-card"
            key={item.label}
            onClick={() => navigate(item.path)}
            type="button"
        >
            <span className={`admin-stat-icon ${item.color}`}>
                {item.icon}
            </span>

            <span className="admin-stat-info">
                <span className="admin-stat-label">{item.label}</span>
                <span className="admin-stat-count">
                    {statsLoading ? "…" : item.count}
                </span>
            </span>
            <span className="admin-stat-arrow">↗</span>
        </button>
    ))}
</section>

{statsError && (
    <p className="admin-stats-error">{statsError}</p>
)}


                <section className="admin-section">
                    <h2>Management</h2>
                    <p className="admin-section-description">
                        Choose a section to manage.
                    </p>

                    <div className="admin-grid">
                        {sections.map((section) => (
                            <article
                                className="admin-card"
                                key={section.title}
                            >
                                <div className="admin-card-icon">
                                    {section.icon}
                                </div>

                                <h3>{section.title}</h3>

                                <p>{section.description}</p>

                                <button
                                    onClick={() => {
                                        if (section.path) {
                                            navigate(section.path);
                                        }
                                    }}
                                    disabled={!section.path}
                                    title={
                                        section.path
                                            ? section.action
                                            : "Management page will be implemented next"
                                    }
                                >
                                    {section.path
                                        ? section.action
                                        : "Coming Next"}
                                </button>
                            </article>
                        ))}
                    </div>
                </section>

                <p className="admin-note">
                  Kiriwawula TripMate · Administration Portal
                  <br />
                  Manage destinations, facilities, media, categories, and registered users.
              </p>
            </main>
        </div>
    );
}
