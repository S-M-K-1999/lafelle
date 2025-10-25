import express from 'express';
import Product from '../models/product.model.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
// ----------------------------------------------------------------------
// READ (GET) ROUTES
// ----------------------------------------------------------------------

// Get all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find().populate('category', 'name description');
      res.json(products);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});
  
  // Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
  

// ----------------------------------------------------------------------
// CREATE (POST) ROUTE
// ----------------------------------------------------------------------

// Add a new product
router.post('/add', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      imageUrl,
      category,
    });

    await newProduct.save();
    res.json({ message: 'Product added successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// UPDATE (PUT) ROUTE
// ----------------------------------------------------------------------

// Update a product by ID
router.put('/update/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price: Number(price), imageUrl, category },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully!', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// DELETE ROUTE
// ----------------------------------------------------------------------

// Delete a product by ID
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
