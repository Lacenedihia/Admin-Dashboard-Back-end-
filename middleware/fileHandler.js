// utils/fileHandler.js
const fs = require('fs');
const path = require('path');

const photoUploadsDir = path.join(__dirname, '../uploads/photos');

// Function to handle a single file upload
const uploadFile = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    // File is already saved by multer, so we just set the filename
    req.body.image = req.file.filename;
    next();
};

// Function to delete a file
const deleteFile = (filename) => {
    if (!filename) {
        return;
    }
    const imagePath = path.join(photoUploadsDir, filename);
    if (fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath);
            console.log(`Successfully deleted old image: ${filename}`);
        } catch (error) {
            console.error(`Error deleting image: ${filename}`, error);
        }
    }
};

module.exports = { uploadFile, deleteFile };