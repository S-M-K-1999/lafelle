const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// version
const version_prefix = process.env.VERSION_PREFIX || "v1";

// Import and use product routes
const productsRouter = require('./routes/products');
app.use(`/${version_prefix}/products`, productsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
module.exports = app;