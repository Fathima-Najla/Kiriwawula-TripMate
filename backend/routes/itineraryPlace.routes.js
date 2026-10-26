const express = require("express");
const ItineraryPlace = require("../models/itineraryPlace.model");
const Itinerary = require("../models/itinerary.model");
const TouristPlace = require("../models/touristPlace.model");

const {
    authMiddleware
} = require("../middleware/auth.middleware");

const router = express.Router();



 // Add Tourist Place to Itinerary — owner only
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            itineraryId,
            placeId,
            visitOrder,
            plannedTime
        } = req.body;

        if (!itineraryId || !placeId || visitOrder == null) {
            return res.status(400).json({
                message: "Please provide itineraryId, placeId and visitOrder"
            });
        }

        // Verify that this itinerary belongs to the logged-in user
        const itinerary = await Itinerary.findOne({
            where: {
                itineraryId,
                userId: req.user.userId
            }
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found."
            });
        }

        const place = await TouristPlace.findByPk(placeId);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found."
            });
        }

        const existingPlace = await ItineraryPlace.findOne({
            where: { itineraryId, placeId }
        });

        if (existingPlace) {
            return res.status(400).json({
                message: "This tourist place is already in the itinerary."
            });
        }

        const itineraryPlace = await ItineraryPlace.create({
            itineraryId,
            placeId,
            visitOrder,
            plannedTime
        });

        return res.status(201).json({
            message: "Tourist place added successfully.",
            itineraryPlace
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong."
        });
    }
});


// Get Places in One Itinerary
router.get("/itinerary/:itineraryId", async (req, res) => {
    try {
        const { itineraryId } = req.params;

        const itinerary = await Itinerary.findByPk(itineraryId);

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        const places = await ItineraryPlace.findAll({
            where: {
                itineraryId: itineraryId
            },
            include: [
                {
                    model: TouristPlace,
                    attributes: [
                        "placeId",
                        "placeName",
                        "location",
                        "latitude",
                        "longitude"
                    ]
                }
            ],
            order: [["visitOrder", "ASC"]]
        });

        return res.status(200).json({
            itineraryId: itineraryId,
            places: places
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});



 // Remove Tourist Place from Itinerary — owner only
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const itineraryPlace = await ItineraryPlace.findByPk(req.params.id);

        if (!itineraryPlace) {
            return res.status(404).json({
                message: "Itinerary place not found."
            });
        }

        // Verify ownership of the parent itinerary
        const itinerary = await Itinerary.findOne({
            where: {
                itineraryId: itineraryPlace.itineraryId,
                userId: req.user.userId
            }
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary place not found."
            });
        }

        await itineraryPlace.destroy();

        return res.status(200).json({
            message: "Tourist place removed successfully."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong."
        });
    }
});


module.exports = router;