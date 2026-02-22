const { imagekit, hasCredentials } = require("./imagekit");
const path = require("path");

/**
 * Upload file to ImageKit
 * @param {Object} file - Express multer file object
 * @param {string} folderName - Folder name in ImageKit (e.g., 'profile-photos', 'aadhaar-cards')
 * @param {string} fileName - Custom filename (optional)
 * @returns {Promise<Object>} - ImageKit response
 */
const uploadToImageKit = async (file, folderName, fileName = null) => {
  try {
    // Check if ImageKit credentials are configured
    if (!hasCredentials) {
      return {
        success: false,
        error: "ImageKit credentials not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in your .env file.",
      };
    }

    // Generate a unique filename if not provided
    const uniqueFileName = fileName || `${Date.now()}-${file.originalname}`;
    const filePath = path.join(folderName, uniqueFileName);

    const uploadResponse = await imagekit.upload({
      file: file.buffer, // Use file buffer instead of file path
      fileName: uniqueFileName,
      folder: folderName,
      useUniqueFileName: false, // We're generating our own unique name
      tags: [folderName],
    });

    return {
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      filePath: uploadResponse.filePath,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete file from ImageKit
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise<Object>} - Deletion response
 */
const deleteFromImageKit = async (fileId) => {
  try {
    if (!hasCredentials) {
      return {
        success: false,
        error: "ImageKit credentials not configured",
      };
    }

    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  uploadToImageKit,
  deleteFromImageKit,
};
