import express from "express";
import Product from "../models/product.model.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import ImageKitService from "../services/imageKitService.js";

const router = express.Router();

// ----------------------------------------------------------------------
// READ (GET)
// ----------------------------------------------------------------------

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name description");
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name description");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// CREATE (POST)
// ----------------------------------------------------------------------

// Add new product (with image upload)
router.post("/add", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image data (base64Image) are required" });
    }

    // Upload image to ImageKit
    const imageKitService = new ImageKitService();
    const uploadResult = await imageKitService.uploadBase64Image(imageUrl, name);

    // Create product
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      imageUrl: uploadResult.url,
      imageFileId: uploadResult.fileId,
      category,
    });

    await newProduct.save();
    res.json({ message: "Product added successfully!", product: newProduct });
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// UPDATE (PUT)
// ----------------------------------------------------------------------

// Update product (with optional image re-upload)
router.put("/update/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    let updatedFields = { name, description, price: Number(price), category };

    // If a new image is provided, upload it and replace old one
    if (imageUrl) {
      const imageKitService = new ImageKitService();
      const uploadResult = await imageKitService.uploadBase64Image(imageUrl, name);

      // Delete old image if available
      const oldProduct = await Product.findById(req.params.id);
      const fileId = oldProduct.imageFileId
      try {
        await imageKitService.deleteImage(fileId);
      } catch (err) {
        console.warn("Old image deletion failed:", err.message);
      }

      updatedFields.imageUrl = uploadResult.url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (err) {
    console.error("Product update error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image from ImageKit
    const imageKitService = new ImageKitService();
    const fileId = product.imageFileId
    try {
      await imageKitService.deleteImage(fileId);
    } catch (err) {
      console.warn("Image deletion failed:", err.message);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
