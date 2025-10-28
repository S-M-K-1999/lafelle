const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/upload.controller');

// POST /v1/upload/image - Upload base64 image to ImageKit
router.post('/image', uploadImage);

// DELETE /v1/upload/image/:fileId - Delete image from ImageKit
router.delete('/image/:fileId', deleteImage);

module.exports = router;