const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoFiles = new Schema({
  length: Number,
  chunkSize: Number,
  uploadDate: String,
  filename: String,
  contentType: String,
});
const Photo_Files = mongoose.model("photos.files", PhotoFiles);
module.exports = Photo_Files;
