const ImageKit = require("imagekit");

class ImageKitService {
  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  async uploadBase64Image(base64Data, fileName, folder = 'products') {
    try {
      // Remove the data:image/... prefix if present
      const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
      
      const uploadResponse = await this.imagekit.upload({
        file: base64String,
        fileName: fileName,
        folder: folder,
        useUniqueFileName: true,
      });

      return {
        success: true,
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        thumbnailUrl: uploadResponse.thumbnailUrl,
        filePath: uploadResponse.filePath,
        height: uploadResponse.height,
        width: uploadResponse.width
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async deleteImage(fileId) {
    try {
      await this.imagekit.deleteFile(fileId);
      return { success: true };
    } catch (error) {
      console.error('ImageKit delete error:', error);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }
}

module.exports = ImageKitService;