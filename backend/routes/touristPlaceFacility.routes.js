const express = require("express");
const TouristPlace = require("../models/touristPlace.model");
const Facility = require("../models/facility.model");
const TouristPlaceFacility = require("../models/touristPlaceFacility.model");

const router = express.Router();


// Assign Facility to Tourist Place
router.post("/:placeId/:facilityId", async (req, res) => {
    try {
        const { placeId, facilityId } = req.params;

        const place = await TouristPlace.findByPk(placeId);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        const facility = await Facility.findByPk(facilityId);

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        const existingAssignment = await TouristPlaceFacility.findOne({
            where: {
                placeId: placeId,
                facilityId: facilityId
            }
        });

        if (existingAssignment) {
            return res.status(400).json({
                message: "Facility is already assigned to this tourist place"
            });
        }

        const assignment = await TouristPlaceFacility.create({
            placeId: placeId,
            facilityId: facilityId
        });

        return res.status(201).json({
            message: "Facility assigned successfully",
            assignment: assignment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// Get Facilities of One Tourist Place
router.get("/place/:placeId", async (req, res) => {
    try {
        const { placeId } = req.params;

        const place = await TouristPlace.findByPk(placeId);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        const facilities = await Facility.findAll({
            include: [
                {
                    model: TouristPlace,
                    where: {
                        placeId: placeId
                    },
                    attributes: []
                }
            ]
        });

        return res.status(200).json({
            facilities: facilities
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// Remove Facility from Tourist Place
router.delete("/:placeId/:facilityId", async (req, res) => {
    try {
        const { placeId, facilityId } = req.params;

        const assignment = await TouristPlaceFacility.findOne({
            where: {
                placeId: placeId,
                facilityId: facilityId
            }
        });

        if (!assignment) {
            return res.status(404).json({
                message: "Facility assignment not found"
            });
        }

        await assignment.destroy();

        return res.status(200).json({
            message: "Facility removed from tourist place successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


module.exports = router;