import { GoogleLogin } from "@react-oauth/google";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);
        

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
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
                throw new Error(data.message || "Google login failed.");
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
            <form onSubmit={handleLogin} style={styles.card}>
                <Link to="/" style={styles.backLink}>
                    ← Back to Home
                </Link>

                <h1 style={styles.heading}>Welcome Back</h1>

                <p style={styles.description}>
                    Sign in to continue your Kiriwawula TripMate journey.
                </p>

                <label style={styles.label} htmlFor="email">
                    Email Address
                </label>

                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    style={styles.input}
                />

                <div style={{ textAlign: "right", marginTop: "8px" }}>
                    <Link
                        to="/forgot-password"
                        style={styles.forgotPasswordLink}
                    >
                        Forgot Password?
                    </Link>
                </div>

                <label style={styles.label} htmlFor="password">
                    Password
                </label>

                
                <div style={styles.passwordWrapper}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
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
                    {loading ? "Signing in..." : "Login"}
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
                            setMessage("Google sign-in failed. Please try again.")
                        }
                        theme="outline"
                        shape="rectangular"
                        text="continue_with"
                        width="350"
                    />
                </div>


                <p style={styles.footer}>
                    Don't have an account?{" "}
                    <Link to="/signup" style={styles.signupLink}>
                        Sign Up
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

    forgotPasswordLink: {
    color: "#1f5135",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: "bold",
    },

    heading: {
        color: "#1f5135",
        marginTop: "28px",
        marginBottom: "10px",
        fontSize: "32px",
    },
    description: {
        color: "#666666",
        lineHeight: 1.6,
        marginBottom: "28px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        marginTop: "18px",
        fontWeight: "bold",
        color: "#333333",
    },
    input: {
        width: "100%",
        padding: "13px",
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
    padding: "13px",
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

export default Login;
