const ImageKitService = require('../services/imageKitService');

const uploadImage = async (req, res) => {
  try {
    const { base64Image, fileName } = req.body;
    
    if (!base64Image || !fileName) {
      return res.status(400).json({
        success: false,
        error: 'Base64 image and file name are required'
      });
    }

    const imageKitService = new ImageKitService();
    const uploadResult = await imageKitService.uploadBase64Image(base64Image, fileName);

    res.json({
      success: true,
      ...uploadResult
    });

  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { fileId } = req.params;
    const imageKitService = new ImageKitService();
    
    await imageKitService.deleteImage(fileId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage
};