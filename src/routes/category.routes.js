import express from "express";
import Category from "../models/category.model.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all categories
router.get("/", verifyToken, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
});

// Get single category
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error });
  }
});

// Create category (Admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Failed to create category", error });
  }
});

// Update category (Admin only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Failed to update category", error });
  }
});

// Delete category (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
});

export default router;
