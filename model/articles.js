const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  image: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ArticlesCategory',
  },
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
  },
  reading_time: {
    type: String,
  },
  keywords: {
    type: [String],
  },
  subtopics: {
    type: [String],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model('Article', articleSchema);