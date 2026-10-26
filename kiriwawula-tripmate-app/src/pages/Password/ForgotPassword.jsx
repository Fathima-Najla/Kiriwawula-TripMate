
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to send request.");
            }

            setMessage(data.message);
        } catch (err) {
            setError(
                err.message || "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Forgot Password?</h2>

                <p style={styles.description}>
                    Enter your registered email address and we will send you
                    a password reset link.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" style={styles.label}>
                        Email Address
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        required
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
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
};
