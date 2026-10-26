const express = require("express");
const Facility = require("../models/facility.model");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/auth.middleware");

const router = express.Router();

// Create Facility
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { facilityName, description } = req.body;

        if (!facilityName) {
            return res.status(400).json({
                message: "Facility name is required"
            });
        }

        const existingFacility = await Facility.findOne({
            where: {
                facilityName: facilityName
            }
        });

        if (existingFacility) {
            return res.status(400).json({
                message: "Facility already exists"
            });
        }

        const facility = await Facility.create({
            facilityName: facilityName,
            description: description
        });

        return res.status(201).json({
            message: "Facility created successfully",
            facility: facility
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// Get All Facilities
router.get("/", async (req, res) => {
    try {
        const facilities = await Facility.findAll();

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


// Update Facility
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { facilityName, description } = req.body;

        const facility = await Facility.findByPk(id);

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        await facility.update({
            facilityName: facilityName,
            description: description
        });

        return res.status(200).json({
            message: "Facility updated successfully",
            facility: facility
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// Delete Facility
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const facility = await Facility.findByPk(id);

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        await facility.destroy();

        return res.status(200).json({
            message: "Facility deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Facility deleted successfully"
        });
    }
});


module.exports = router;
