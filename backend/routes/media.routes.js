
const express = require("express");
const Media = require("../models/media.model");
const TouristPlace = require("../models/touristPlace.model");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/auth.middleware");

const router = express.Router();

// Create Media
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { placeId, mediaType, mediaUrl } = req.body;

        if (!placeId || !mediaType || !mediaUrl) {
            return res.status(400).json({
                message: "Please provide placeId, mediaType and mediaUrl"
            });
        }

        if (!["image", "video"].includes(mediaType)) {
            return res.status(400).json({
                message: "mediaType must be image or video"
            });
        }

        const place = await TouristPlace.findByPk(placeId);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        const media = await Media.create({
            placeId,
            mediaType,
            mediaUrl
        });

        return res.status(201).json({
            message: "Media created successfully",
            media
        });
    } catch (error) {
        console.error("Create media error:", error);

        return res.status(500).json({
            message: "Something went wrong while creating media"
        });
    }
});

// Get All Media
router.get("/", async (req, res) => {
    try {
        const media = await Media.findAll({
            include: [
                {
                    model: TouristPlace,
                    attributes: ["placeId", "placeName"]
                }
            ]
        });

        return res.status(200).json({ media });
    } catch (error) {
        console.error("Get media error:", error);

        return res.status(500).json({
            message: "Something went wrong while loading media"
        });
    }
});

// Get Media for One Tourist Place
router.get("/place/:placeId", async (req, res) => {
    try {
        const { placeId } = req.params;

        const media = await Media.findAll({
            where: { placeId }
        });

        return res.status(200).json({ media });
    } catch (error) {
        console.error("Get place media error:", error);

        return res.status(500).json({
            message: "Something went wrong while loading place media"
        });
    }
});

// Update Media - NEW ROUTE
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { placeId, mediaType, mediaUrl } = req.body;

        if (!placeId || !mediaType || !mediaUrl) {
            return res.status(400).json({
                message: "Please provide placeId, mediaType and mediaUrl"
            });
        }

        if (!["image", "video"].includes(mediaType)) {
            return res.status(400).json({
                message: "mediaType must be image or video"
            });
        }

        const media = await Media.findByPk(id);

        if (!media) {
            return res.status(404).json({
                message: "Media not found"
            });
        }

        const place = await TouristPlace.findByPk(placeId);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        await media.update({
            placeId,
            mediaType,
            mediaUrl
        });

        return res.status(200).json({
            message: "Media updated successfully",
            media
        });
    } catch (error) {
        console.error("Update media error:", error);

        return res.status(500).json({
            message: "Something went wrong while updating media"
        });
    }
});

// Delete Media
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findByPk(id);

        if (!media) {
            return res.status(404).json({
                message: "Media not found"
            });
        }

        await media.destroy();

        return res.status(200).json({
            message: "Media deleted successfully"
        });
    } catch (error) {
        console.error("Delete media error:", error);

        return res.status(500).json({
            message: "Something went wrong while deleting media"
        });
    }
});

module.exports = router;
