require("dotenv").config();

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const { Op } = require("sequelize");
const PasswordReset = require("./models/PasswordReset");
const { sendResetEmail } = require("./utils/emailService");

// require("./models");

const sequelize = require("./models");



const User = require("./models/user.model");
const Itinerary = require("./models/itinerary.model");
const ItineraryPlace = require("./models/itineraryPlace.model");
const itineraryRoutes = require("./routes/itinerary.routes");
const itineraryPlaceRoutes = require("./routes/itineraryPlace.routes");
const TouristPlace = require("./models/touristPlace.model");
const Media = require("./models/media.model");
const Category = require("./models/category.model");
const Facility = require("./models/facility.model");
const TouristPlaceFacility = require("./models/touristPlaceFacility.model");
const facilityRoutes = require("./routes/facility.routes");
const touristPlaceFacilityRoutes = require("./routes/touristPlaceFacility.routes");

const touristPlaceRoutes = require("./routes/touristPlace.routes");

const attractionRoutes = require("./routes/attraction.routes");
const mediaRoutes = require("./routes/media.routes");
const {
    authMiddleware,
    adminMiddleware
} = require("./middleware/auth.middleware");




const app = express();
app.use("/images", express.static("images"));
app.use("/videos", express.static("videos"));

const categoryRoutes = require("./routes/category.routes");

TouristPlace.hasMany(Media, {
    foreignKey: "placeId",
    onDelete: "CASCADE"
});

Media.belongsTo(TouristPlace, {
    foreignKey: "placeId"
});

Category.hasMany(TouristPlace, {
    foreignKey: "categoryId"
});

TouristPlace.belongsTo(Category, {
    foreignKey: "categoryId"
});

TouristPlace.belongsToMany(Facility, {
    through: TouristPlaceFacility,
    foreignKey: "placeId",
    otherKey: "facilityId"
});

Facility.belongsToMany(TouristPlace, {
    through: TouristPlaceFacility,
    foreignKey: "facilityId",
    otherKey: "placeId"
});

User.hasMany(Itinerary, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Itinerary.belongsTo(User, {
    foreignKey: "userId"
});

Itinerary.hasMany(ItineraryPlace, {
    foreignKey: "itineraryId",
    onDelete: "CASCADE"
});

ItineraryPlace.belongsTo(Itinerary, {
    foreignKey: "itineraryId"
});

TouristPlace.hasMany(ItineraryPlace, {
    foreignKey: "placeId",
    onDelete: "CASCADE"
});

ItineraryPlace.belongsTo(TouristPlace, {
    foreignKey: "placeId"
});

sequelize.sync()
  .then(() => {
    console.log("Database tables synchronized!");
  })
  .catch((error) => {
    console.error("Database synchronization failed:", error);
  });

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/categories", categoryRoutes);
app.use("/tourist-places", touristPlaceRoutes);
app.use("/", attractionRoutes);
app.use("/media", mediaRoutes);
app.use("/facilities", facilityRoutes);
app.use("/tourist-place-facilities", touristPlaceFacilityRoutes);
app.use("/itineraries", itineraryRoutes);
app.use("/itinerary-places", itineraryPlaceRoutes);

// Test API
app.get("/hello", async (req, res) => {
    return res.status(200).json({
        message: "Hello-backend!"
    });
});

// Create Account
app.post("/create-account", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check whether email already exists
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully",
            userId: user.userId
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                role: user.role
            },
            "KIRIWAWULA_SECRET_KEY",
            {
                expiresIn: "1h"
            }
            );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


 // Google Login
app.post("/google-login", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required."
            });
        }

        // Verify the credential with Google.
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.email ||
            payload.email_verified !== true
        ) {
            return res.status(401).json({
                message: "Google account email could not be verified."
            });
        }

        const email = payload.email.trim().toLowerCase();
        const fullName =
            payload.name || email.split("@")[0];

        // Find an existing account using the verified email.
        let user = await User.findOne({
            where: { email }
        });

        // Create a regular user account if one does not exist.
        if (!user) {
            const randomPassword = crypto
                .randomBytes(32)
                .toString("hex");

            const hashedPassword = await bcrypt.hash(
                randomPassword,
                10
            );

            user = await User.create({
                fullName: fullName,
                email: email,
                password: hashedPassword
                // role defaults to "user"
            });
        }

        // Issue the same type of application JWT as normal login.
        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET ||
                "KIRIWAWULA_SECRET_KEY",
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Google login successful",
            token: token,
            user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Google login error:", error.message);

        return res.status(401).json({
            message: "Google sign-in failed. Please try again."
        });
    }
});


app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                message: "Please enter your email address.",
            });
        }

        const user = await User.findOne({
            where: { email: email.trim() },
        });

        // Use the same response whether or not the account exists.
        const message =
            "If an account exists for that email, a password reset link will be sent.";

        if (!user) {
            return res.json({ message });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Invalidate previous unused reset tokens for this user.
        await PasswordReset.update(
            { usedAt: new Date() },
            {
                where: {
                    userId: user.userId,
                    usedAt: null,
                },
            }
        );

        await PasswordReset.create({
            userId: user.userId,
            tokenHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        try {
            await sendResetEmail(user.email, resetLink);
        } catch (emailError) {
            // Invalidate the token if the email could not be sent.
            await PasswordReset.update(
                { usedAt: new Date() },
                { where: { tokenHash, usedAt: null } }
            );

            throw emailError;
        }

        return res.json({ message });
    } catch (error) {
        console.error("Forgot password error:", error.message);

        return res.status(500).json({
            message: "Unable to process the request right now. Please try again later.",
        });
    }
});


app.post("/reset-password", async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Please complete all fields.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match.",
            });
        }

        // Hash the token received from the email link.
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find a token that is unused and has not expired.
        const resetRecord = await PasswordReset.findOne({
            where: {
                tokenHash,
                usedAt: null,
            },
        });

        if (!resetRecord || new Date(resetRecord.expiresAt) <= new Date()) {
            return res.status(400).json({
                message: "This reset link is invalid or expired. Please request a new one.",
            });
        }

        // Hash the new password before saving it.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new password.
        await User.update(
            { password: hashedPassword },
            { where: { userId: resetRecord.userId } }
        );

        // Mark the reset token as used.
        await PasswordReset.update(
            { usedAt: new Date() },
            {
                where: {
                    resetId: resetRecord.resetId,
                    usedAt: null,
                },
            }
        );

        return res.status(200).json({
            message: "Password reset successfully. Please log in with your new password.",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Unable to reset the password right now. Please try again.",
        });
    }
});



// Protected test API
app.get("/profile", authMiddleware, async (req, res) => {
    return res.status(200).json({
        message: "You are authenticated!",
        user: req.user
    });
});

// Verify administrator access
app.get(
    "/admin/verify",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        return res.status(200).json({
            message: "Admin access verified",
            user: req.user,
        });
    }
);

// Get all registered users (admin only)
app.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: [
                    "userId",
                    "fullName",
                    "email",
                    "role",
                ],
                order: [["userId", "ASC"]],
            });

            return res.status(200).json({ users });
        } catch (error) {
            console.error("Fetch users error:", error);

            return res.status(500).json({
                message: "Failed to fetch users.",
            });
        }
    }
);

// Update a user's name and email (admin only)
app.put(
    "/users/:userId",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            const { fullName, email } = req.body;

            if (!Number.isInteger(userId) || userId <= 0) {
                return res.status(400).json({
                    message: "Invalid user ID.",
                });
            }

            if (
                typeof fullName !== "string" ||
                !fullName.trim() ||
                typeof email !== "string" ||
                !email.trim()
            ) {
                return res.status(400).json({
                    message: "Full name and email are required.",
                });
            }

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                });
            }

            // Check whether another user already has this email
            const existingUser = await User.findOne({
                where: { email: email.trim() },
            });

            if (
                existingUser &&
                Number(existingUser.userId) !== userId
            ) {
                return res.status(409).json({
                    message: "That email is already in use.",
                });
            }

            await user.update({
                fullName: fullName.trim(),
                email: email.trim(),
            });

            return res.status(200).json({
                message: "User updated successfully.",
            });
        } catch (error) {
            console.error("Update user error:", error);

            return res.status(500).json({
                message: "Failed to update user.",
            });
        }
    }
);

// Delete a user (admin only)
app.delete(
    "/users/:userId",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const userId = Number(req.params.userId);

            if (!Number.isInteger(userId) || userId <= 0) {
                return res.status(400).json({
                    message: "Invalid user ID.",
                });
            }

            // Prevent the admin from deleting their own account
            if (Number(req.user.userId) === userId) {
                return res.status(400).json({
                    message: "You cannot delete your own account.",
                });
            }

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                });
            }

            await user.destroy();

            return res.status(200).json({
                message: "User deleted successfully.",
            });
        } catch (error) {
            console.error("Delete user error:", error);

            return res.status(500).json({
                message:
                    "Could not delete this user. They may have related records.",
            });
        }
    }
);

//start sever 

app.listen(8000, () => {
    console.log("Backend server running on port 8000");
});

module.exports = app;