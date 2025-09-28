const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
const version_prefix = process.env.VERSION_PREFIX || "v1";

mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

const productsRouter = require('./routes/products');
app.use(`/${version_prefix}/products`, productsRouter);
app.get(`/${version_prefix}/health`, (req, res) => {
    res.status(200).send('OK');
});
module.exports.handler = serverless(app);