

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";


const SignUp = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/create-account",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                  body: JSON.stringify({
                  fullName: name,
                  email,
                  password,
                  }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Account creation failed.");
            }

            navigate("/login", {
                state: { message: "Account created successfully. Please log in." },
            });
        } catch (error) {
            setMessage(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Please check that your backend is running."
                    : error.message
            );
        } finally {
            setLoading(false);
        }
    };

    
    const handleGoogleSuccess = async (credentialResponse) => {
        setMessage("");
        setLoading(true);

        try {
            if (!credentialResponse.credential) {
                throw new Error("Google sign-in did not return a credential.");
            }

            const response = await fetch("http://localhost:8000/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Google sign-up failed.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setMessage(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Please check that your backend is running."
                    : error.message
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={styles.page}>
            <form onSubmit={handleSignUp} style={styles.card}>
                <Link to="/" style={styles.backLink}>
                    ← Back to Home
                </Link>

                <h1 style={styles.heading}>Create Account</h1>

                <p style={styles.description}>
                    Join Kiriwawula TripMate and start planning your trips.
                </p>

                <label htmlFor="name" style={styles.label}>
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                    style={styles.input}
                />

                <label htmlFor="email" style={styles.label}>
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    style={styles.input}
                />

                <label htmlFor="password" style={styles.label}>
                    Password
                </label>
                
                <div style={styles.passwordWrapper}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        style={styles.passwordInput}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        style={styles.eyeButton}
                    >
                        <svg width="21" height="21" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true">
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                            {!showPassword && <path d="M3 3l18 18" />}
                        </svg>
                    </button>
                </div>

                <label htmlFor="confirmPassword" style={styles.label}>
                    Confirm Password
                </label>
                
                <div style={styles.passwordWrapper}>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        style={styles.passwordInput}
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((previous) => !previous)}
                        aria-label={
                            showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                        }
                        style={styles.eyeButton}
                    >
                        <svg width="21" height="21" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true">
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                            {!showConfirmPassword && <path d="M3 3l18 18" />}
                        </svg>
                    </button>
                </div>


                {message && (
                    <p role="alert" style={styles.error}>
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        margin: "22px 0",
                        color: "#888",
                        fontSize: "14px",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "#ddd",
                        }}
                    />
                    <span>or continue with</span>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "#ddd",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() =>
                            setMessage("Google sign-up failed. Please try again.")
                        }
                        theme="outline"
                        shape="rectangular"
                        text="signup_with"
                        width="350"
                    />
                </div>


                <p style={styles.footer}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.signupLink}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#f8f7f3",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        width: "100%",
        maxWidth: "430px",
        padding: "36px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    },
    backLink: {
        color: "#1f5135",
        textDecoration: "none",
        fontSize: "14px",
    },
    heading: {
        color: "#1f5135",
        marginTop: "24px",
        marginBottom: "10px",
        fontSize: "30px",
    },
    description: {
        color: "#666666",
        lineHeight: 1.6,
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginTop: "16px",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#333333",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #dddddd",
        borderRadius: "8px",
        fontSize: "15px",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: "14px",
        marginTop: "24px",
        background: "#1f5135",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    error: {
        color: "#b42318",
        fontSize: "14px",
        marginTop: "16px",
    },
    footer: {
        textAlign: "center",
        marginTop: "24px",
        color: "#666666",
        fontSize: "14px",
    },
    signupLink: {
        color: "#1f5135",
        fontWeight: "bold",
        textDecoration: "none",
    },

    
passwordWrapper: {
    position: "relative",
    width: "100%",
},

passwordInput: {
    width: "100%",
    padding: "12px",
    paddingRight: "46px",
    border: "1px solid #dddddd",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
},

eyeButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#1f5135",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
},

};

export default SignUp;
