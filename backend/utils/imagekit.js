require('dotenv').config();
const ImageKit = require("imagekit");

// Check if ImageKit credentials are available
const hasCredentials = 
  process.env.IMAGEKIT_PUBLIC_KEY && 
  process.env.IMAGEKIT_PRIVATE_KEY && 
  process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit = null;

if (hasCredentials) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

module.exports = { imagekit, hasCredentials };
