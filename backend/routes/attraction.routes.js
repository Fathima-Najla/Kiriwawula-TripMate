const express = require("express");
const Attraction = require("../models/Attraction");

const router = express.Router();

router.get("/tourist-places/:placeId/attractions", async (req, res) => {
    try {
        const attractions = await Attraction.findAll({
            where: {
                placeId: req.params.placeId
            },
            order: [["attractionId", "ASC"]]
        });

        res.status(200).json({
            placeId: req.params.placeId,
            attractions
        });
    } catch (error) {
        console.error("Error fetching attractions:", error);
        res.status(500).json({
            message: "Failed to fetch attractions."
        });
    }
});

module.exports = router;