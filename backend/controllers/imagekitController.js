const { imagekit, hasCredentials } = require("../utils/imagekit");
const upload = require("../middleware/multer");

// Server-side upload endpoint
exports.uploadFile = async (req, res) => {
  try {
    if (!hasCredentials) {
      return res.status(500).json({ 
        success: false,
        error: "ImageKit credentials not configured. Please set environment variables." 
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided"
      });
    }

    const { folder, fileName } = req.body;
    const uniqueFileName = fileName || `${Date.now()}-${req.file.originalname}`;

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: uniqueFileName,
      folder: folder || "uploads",
      useUniqueFileName: false,
      tags: [folder || "uploads"],
    });

    res.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      filePath: uploadResponse.filePath,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
