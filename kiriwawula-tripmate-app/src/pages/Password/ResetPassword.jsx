
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError("The reset link is missing its token. Please request a new link.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password,
                        confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to reset password.");
            }

            setMessage(data.message);
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Reset Your Password</h2>

                <p style={styles.description}>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="password" style={styles.label}>
                        New Password
                    </label>

                    
                    <div style={styles.passwordWrapper}>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 8 characters"
                            minLength={8}
                            autoComplete="new-password"
                            required
                            style={styles.passwordInput}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((previous) => !previous)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            style={styles.eyeButton}
                        >
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                                {!showPassword && <path d="M3 3l18 18" />}
                            </svg>
                        </button>
                    </div>



                    <label htmlFor="confirmPassword" style={styles.label}>
                        Confirm New Password
                    </label>

                    
                    <div style={styles.passwordWrapper}>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Enter the password again"
                            minLength={8}
                            autoComplete="new-password"
                            required
                            style={styles.passwordInput}
                        />

                        
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((previous) => !previous)
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                            }
                            style={styles.eyeButton}
                        >
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                                {!showConfirmPassword && (
                                    <path d="M3 3l18 18" />
                                )}
                            </svg>
                        </button>

                    </div>



                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <p style={styles.backLink}>
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        padding: "32px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "12px",
    },
    description: {
        color: "#555555",
        lineHeight: 1.6,
        marginBottom: "24px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        marginBottom: "16px",
        border: "1px solid #cccccc",
        borderRadius: "6px",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#8b6b45",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
    },
    success: {
        color: "green",
        marginTop: "16px",
        overflowWrap: "anywhere",
    },
    error: {
        color: "red",
        marginTop: "16px",
        overflowWrap: "anywhere",
    },
    backLink: {
        textAlign: "center",
        marginTop: "20px",
    },
    
toggleButton: {
    marginBottom: "16px",
    padding: "6px 10px",
    backgroundColor: "#f3eee8",
    color: "#5c4630",
    border: "1px solid #d6c7b7",
    borderRadius: "6px",
    cursor: "pointer",
},


passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "16px",
},
passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    paddingRight: "46px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "16px",
},
eyeButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#5c4630",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
},


};
