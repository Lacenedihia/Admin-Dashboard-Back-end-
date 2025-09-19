const express = require("express");

const {
    createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById
} = require("../controllers/CategoryController");
const router = express.Router();

router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);
router.post("/add", createCategory);
router.put("/update/:categoryId", updateCategory);
router.delete("/delete/:categoryId", deleteCategory);

module.exports = router;
