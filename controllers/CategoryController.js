
const ArticlesCategory = require("../model/ArticlesCategory");


const getAllCategories = async (req, res) => {
    try {
        const allCategories = await ArticlesCategory.find({});

        res.json({ categories: allCategories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories, please try again' });
    }
};

const createCategory = async (req, res) => {
    console.log('=== CREATE CATEGORY ENDPOINT HIT ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    console.log('====================================');

    try {
        const { category } = req.body;

        if (!category) {
            console.log('Category is missing from request');
            return res.status(400).json({ message: 'Category is required' });
        }

        console.log('Looking for existing category:', category);
        const existingCategory = await ArticlesCategory.findOne({ category });

        if (existingCategory) {
            console.log('Category already exists');
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new ArticlesCategory({
            category,
        });

        console.log('Saving new category...');
        const savedCategory = await newCategory.save();
        console.log('Category saved successfully:', savedCategory);

        res.status(201).json({ message: 'Category created successfully', category: savedCategory });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Error creating category, please try again' });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const categoryId = req.params.categoryId;

        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const existingCategory = await ArticlesCategory.findById(categoryId);

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        existingCategory.category = category;

        const updatedCategory = await existingCategory.save();

        res.json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category, please try again' });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        if (!categoryId) {
            return res.status(400).json({ message: 'Category Id is required' });
        }

        const category = await ArticlesCategory.findById(categoryId);



        res.json({ category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching category, please try again' });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const existingCategory = await ArticlesCategory.findById(categoryId);

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await existingCategory.deleteOne();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting category, please try again' });
    }
};


module.exports = { getCategoryById, createCategory, updateCategory, deleteCategory, getAllCategories };

