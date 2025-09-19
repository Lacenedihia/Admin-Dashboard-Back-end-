// Import the new file handler
const { deleteFile } = require('../middleware/fileHandler.js');
const Article = require("../model/articles");

const fs = require('fs');
const path = require('path');
// No longer need to import fs and path here

// New, corrected getImage function
const getImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const imagePath = path.join(__dirname, '../uploads/photos', imageId);

    // Check if the file exists before sending
    if (fs.existsSync(imagePath)) {
      // Set headers and send the file
      res.set('Cache-Control', 'public, max-age=604800, immutable');
      res.sendFile(imagePath);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error({ error });
    res.status(500).json({ message: "Error getting image" });
  }
};
// The other functions are now simpler
const getArticlesAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const totalCount = await Article.countDocuments({});

    // The image field is already a filename, no need for -image
    let articles = await Article.find({})
      .populate('category')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.send({
      articles,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });

  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Error getting admin articles" });
  }
};

const getArticlesByCategory = async (req, res) => {
  const { category } = req.body;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.option) || 5;
  const skip = (page - 1) * limit;

  try {
    // You no longer need to process images here, as the frontend will fetch them via a separate route
    const articles = await Article.find({ category })
      .populate('category')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.send(articles);
  } catch (error) {
    console.log({ error });
    res.status(404).json({ message: "Error getting articles" });
  }
};

const getArticlesById = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const article = await Article.findById(articleId).populate('category').lean();

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // The image logic is now a separate route, so you just send the article
    res.status(200).json(article);
  } catch (error) {
    console.error({ error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const postArticle = async (req, res) => {
  const { title, description, text, author, keywords, reading_time, subtopics, category, date, image } = req.body;

  try {
    let article = new Article({
      title,
      text,
      author,
      keywords,
      subtopics,
      category,
      reading_time,
      date,
      description,
      image // Image filename is already set by the middleware
    });

    const savedArticle = await article.save();

    res.status(201).json({
      message: "Article saved successfully",
      article: savedArticle
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error saving your article, please try again"
    });
  }
};

const updateArticle = async (req, res) => {
  const articleId = req.params.articleId;

  try {
    const { description, title, text, author, keywords, reading_time, subtopics, category, date } = req.body;
    const article = await Article.findById(articleId);

    if (!article) {
      // If a new file was uploaded, we need to delete it since the article wasn't found
      if (req.file) {
        deleteFile(req.file.filename);
      }
      return res.status(404).json({ message: "Article not found" });
    }

    // If there's a new file, delete the old one
    if (req.file) {
      deleteFile(article.image);
      article.image = req.file.filename;
    }

    // Update other fields
    if (title) article.title = title;
    if (description) article.description = description;
    if (text) article.text = text;
    if (author) article.author = author;
    if (keywords) article.keywords = keywords;
    if (reading_time) article.reading_time = reading_time;
    if (subtopics) article.subtopics = subtopics;
    if (category) article.category = category;
    if (date) article.date = date;

    const updatedArticle = await article.save();
    res.json({
      message: "Article updated successfully",
      article: updatedArticle
    });
  } catch (error) {
    console.error(error);
    // If a new file was uploaded but the save failed, delete it
    if (req.file) {
      deleteFile(req.file.filename);
    }
    res.status(500).json({ message: "Error updating article" });
  }
};

const deleteArticle = async (req, res) => {
  const articleId = req.params.articleId;

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Use the new deleteFile function
    deleteFile(article.image);

    await Article.findByIdAndDelete(articleId);

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting the article" });
  }
};

const getArticles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const totalArticles = await Article.countDocuments();
    const articles = await Article.find({})
      .populate('category')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalArticles / limit);

    res.status(200).json({
      articles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error({ error });
    res.status(500).json({ message: "Error getting articles" });
  }
};

module.exports = {
  getImage,
  getArticlesAdmin,
  getArticlesById,
  deleteArticle,
  getArticles,
  postArticle,
  getArticlesByCategory,
  updateArticle
};