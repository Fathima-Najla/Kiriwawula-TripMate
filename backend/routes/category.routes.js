const express = require("express");
const Category = require("../models/category.model");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/auth.middleware");

const router = express.Router();

// Create Category
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { categoryName, description } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            where: { categoryName: categoryName }
        });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            categoryName: categoryName,
            description: description
        });

        return res.status(201).json({
            message: "Category created successfully",
            category: category
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Get All Categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll();

        return res.status(200).json({
            categories: categories
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Update Category
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, description } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await category.update({
            categoryName: categoryName,
            description: description
        });

        return res.status(200).json({
            message: "Category updated successfully",
            category: category
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Delete Category
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await category.destroy();

        return res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

module.exports = router;