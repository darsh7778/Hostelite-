const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const UserProfile = require("../models/UserProfile");
const https = require("https");
const http = require("http");

// Helper function to download image from URL
const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 200) {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Image download timeout'));
    });
  });
};


exports.downloadProfilePDF = async (req, res) => {
  try {
    //  FIX 1: Find by user ID (not profile _id)
    const profile = await UserProfile.findOne({ user: req.params.id })
      .populate("user", "email role");

    //  FIX 2: Prevent crash if profile not found
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${profile.fullName || "student_profile"}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Logo
    const logoPath = path.join(__dirname, "../assets/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { fit: [100, 100], align: "center" });
    }
    

    doc.moveDown();
    doc.fontSize(18).text("User Profile Information", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Full Name: ${profile.fullName}`);
    doc.text(`Father Name: ${profile.fatherName}`);
    doc.text(`Mother Name: ${profile.motherName}`);
    doc.text(`Email: ${profile.user?.email || "N/A"}`);
    doc.text(`Phone.No: ${profile.user?.phone || "N/A"}`);
    doc.text(`Role: ${profile.role}`);
    doc.text(`Aadhaar Number: ${profile.aadhaarNumber}`);
    doc.text(`Permanent Address: ${profile.permanentAddress || profile.address}`);
    doc.moveDown();

    // Profile Photo (Handle ImageKit URLs)
    if (profile.profilePhoto) {
      try {
        doc.text("Profile Photo:");
        
        // Check if it's an ImageKit URL or local path
        if (profile.profilePhoto.startsWith('http')) {
          // Download from ImageKit
          const imageBuffer = await downloadImage(profile.profilePhoto);
          doc.image(imageBuffer, { fit: [150, 150] });
        } else {
          // Handle legacy local file path
          const profilePhotoPath = path.join(__dirname, "..", profile.profilePhoto);
          if (fs.existsSync(profilePhotoPath)) {
            doc.image(profilePhotoPath, { fit: [150, 150] });
          } else {
            doc.text("(Profile photo not available)");
          }
        }
        doc.moveDown();
      } catch (error) {
        console.error("Error adding profile photo to PDF:", error);
        doc.text("(Profile photo could not be loaded)");
        doc.moveDown();
      }
    }

    // Aadhaar Photo (Handle ImageKit URLs)
    if (profile.aadhaarPhoto) {
      try {
        doc.text("Aadhaar Document:");
        
        // Check if it's an ImageKit URL or local path
        if (profile.aadhaarPhoto.startsWith('http')) {
          // Download from ImageKit
          const imageBuffer = await downloadImage(profile.aadhaarPhoto);
          doc.image(imageBuffer, { fit: [250, 200] });
        } else {
          // Handle legacy local file path
          const aadhaarPhotoPath = path.join(__dirname, "..", profile.aadhaarPhoto);
          if (fs.existsSync(aadhaarPhotoPath)) {
            doc.image(aadhaarPhotoPath, { fit: [250, 200] });
          } else {
            doc.text("(Aadhaar document not available)");
          }
        }
        doc.moveDown();
      } catch (error) {
        console.error("Error adding aadhaar photo to PDF:", error);
        doc.text("(Aadhaar document could not be loaded)");
        doc.moveDown();
      }
    }

    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({
      message: "Error generating PDF",
    });
  }
};
