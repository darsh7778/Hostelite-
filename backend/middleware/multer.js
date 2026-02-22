const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

createFolder("uploads/aadhaar");
createFolder("uploads/profile");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "aadhaarPhoto") {
      cb(null, "uploads/aadhaar");
    } else {
      cb(null, "uploads/profile");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
