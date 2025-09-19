const express = require("express");
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../middleware/fileHandler.js'); // Import the new middleware

const {
    getArticles,
    postArticle,
    getArticlesByCategory,
    updateArticle,
    deleteArticle,
    getArticlesById,
    getArticlesAdmin,
    getImage
} = require("../controllers/articlesController");


// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/photos');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// The `upload.single('image')` middleware handles the file saving
// The `uploadFile` middleware extracts the filename and adds it to the bod


router.get("/image/:imageId", getImage);
router.get("/data", getArticles);
router.get("/data/admin", getArticlesAdmin);
router.get("/data/:articleId", getArticlesById);
router.post("/data-category", getArticlesByCategory);
router.post("/post", upload.single('image'), uploadFile, postArticle);
router.put("/update/:articleId", upload.single('image'), uploadFile, updateArticle);
router.delete("/delete/:articleId", deleteArticle);

module.exports = router;
