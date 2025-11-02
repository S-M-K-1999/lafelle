import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js"; // ✅ updated import

dotenv.config();

const app = express();

// ✅ Increase JSON and form-data body size limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri)
  .then(() =>
    console.log("✅ MongoDB database connection established successfully")
  )
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Version prefix
const version_prefix = process.env.VERSION_PREFIX || "v1";

// Routes
app.use(`/${version_prefix}/auth`, authRoutes);
app.use(`/${version_prefix}/categories`, categoryRoutes);
app.use(`/${version_prefix}/products`, productsRouter);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});

export default app; // ✅ ESM export
