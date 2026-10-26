
const express = require("express");

const Itinerary = require("../models/itinerary.model");
const ItineraryPlace = require("../models/itineraryPlace.model");
const TouristPlace = require("../models/touristPlace.model");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Get the logged-in user's itineraries
router.get("/mine", authMiddleware, async (req, res) => {
    try {
        console.log("Logged-in user from token:", req.user);
        const itineraries = await Itinerary.findAll({
            where: { userId: req.user.userId },
            include: [
                {
                    model: ItineraryPlace,
                    include: [
                        {
                            model: TouristPlace,
                            attributes: [
                                "placeId",
                                "placeName",
                                "location",
                            ],
                        },
                    ],
                },
            ],
            order: [["itineraryId", "DESC"]],
        });

        return res.status(200).json({ itineraries });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to load itineraries.",
        });
    }
});

// Create an itinerary for the logged-in user
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { itineraryName, travelDate } = req.body;

        if (!itineraryName || !itineraryName.trim()) {
            return res.status(400).json({
                message: "Please provide an itinerary name.",
            });
        }

        const itinerary = await Itinerary.create({
            userId: req.user.userId,
            itineraryName: itineraryName.trim(),
            travelDate: travelDate || null,
        });

        return res.status(201).json({
            message: "Itinerary created successfully.",
            itinerary,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to create itinerary.",
        });
    }
});

// Get one itinerary — owner only
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({
            where: {
                itineraryId: req.params.id,
                userId: req.user.userId,
            },
            include: [
                {
                    model: ItineraryPlace,
                    include: [
                        {
                            model: TouristPlace,
                            attributes: [
                                "placeId",
                                "placeName",
                                "location",
                                "latitude",
                                "longitude",
                            ],
                        },
                    ],
                },
            ],
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found.",
            });
        }

        return res.status(200).json({ itinerary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to load itinerary.",
        });
    }
});

// Update an itinerary — owner only
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({
            where: {
                itineraryId: req.params.id,
                userId: req.user.userId,
            },
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found.",
            });
        }

        const { itineraryName, travelDate } = req.body;

        await itinerary.update({
            ...(itineraryName !== undefined
                ? { itineraryName: itineraryName.trim() }
                : {}),
            ...(travelDate !== undefined
                ? { travelDate: travelDate || null }
                : {}),
        });

        return res.status(200).json({
            message: "Itinerary updated successfully.",
            itinerary,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to update itinerary.",
        });
    }
});

// Delete an itinerary — owner only
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({
            where: {
                itineraryId: req.params.id,
                userId: req.user.userId,
            },
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found.",
            });
        }

        await itinerary.destroy();

        return res.status(200).json({
            message: "Itinerary deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to delete itinerary.",
        });
    }
});

module.exports = router;
