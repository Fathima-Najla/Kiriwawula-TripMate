const express = require("express");
const TouristPlace = require("../models/touristPlace.model");
const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/auth.middleware");

const Category = require("../models/category.model");
const Facility = require("../models/facility.model");
const TouristPlaceFacility = require("../models/touristPlaceFacility.model");

const router = express.Router();

// Create Tourist Place
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            placeName,
            categoryId,
            description,
            location,
            latitude,
            longitude,
            entranceFee,
            openingTime,
            closingTime,
            facilityIds
        } = req.body;

        if (!placeName || !categoryId || !description || !location || !latitude || !longitude) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(400).json({
                message: "Category not found"
            });
        }

        const place = await TouristPlace.create({
    placeName,
    categoryId,
    description,
    location,
    latitude,
    longitude,
    entranceFee,
    openingTime,
    closingTime
});

if (Array.isArray(facilityIds)) {
    await place.setFacilities(facilityIds);
}

        return res.status(201).json({
            message: "Tourist place created successfully",
            place: place
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Get All Tourist Places
// router.get("/", async (req, res) => {
//     try {
//         const places = await TouristPlace.findAll({
//             include: [
//                 {
//                     model: Category,
//                     attributes: ["categoryId", "categoryName"]
//                 }
//             ]
//         });

//         return res.status(200).json({
//             places: places
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Something went wrong"
//         });
//     }
// });

// Get All / Search / Filter Tourist Places
router.get("/", async (req, res) => {
    try {
        const { search, categoryId } = req.query;

        const whereCondition = {};

        // Search by place name
        if (search) {
            whereCondition.placeName = {
                [require("sequelize").Op.like]: `%${search}%`
            };
        }

        // Filter by category
        if (categoryId) {
            whereCondition.categoryId = categoryId;
        }

        const places = await TouristPlace.findAll({
            where: whereCondition,
            include: [
                {
                    model: Category,
                    attributes: ["categoryId", "categoryName"]
                }
            ]
        });

        return res.status(200).json({
            places: places
        });

    } catch (error) {
    console.error("Create Tourist Place error:", error);

    return res.status(500).json({
        message: "Something went wrong",
        error: error.message
    });
}
});

// Get Tourist Place by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const place = await TouristPlace.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ["categoryId", "categoryName"]
                },
                {
                    model: Facility,
                    through: {
                        attributes: []
                    },
                    attributes: ["facilityId", "facilityName"]
                }
            ]
        });

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        return res.status(200).json({
            place: place
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Update Tourist Place
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const place = await TouristPlace.findByPk(id);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        const { facilityIds, ...placeData } = req.body;

            await place.update(placeData);

            if (Array.isArray(facilityIds)) {
                await place.setFacilities(facilityIds);
            }

        return res.status(200).json({
            message: "Tourist place updated successfully",
            place: place
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Delete Tourist Place
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const place = await TouristPlace.findByPk(id);

        if (!place) {
            return res.status(404).json({
                message: "Tourist place not found"
            });
        }

        await place.destroy();

        return res.status(200).json({
            message: "Tourist place deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

module.exports = router;