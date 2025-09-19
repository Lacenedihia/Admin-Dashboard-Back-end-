const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoChunks = new Schema({
  files_id: mongoose.Schema.Types.ObjectId,
  n: Number,
  data: Buffer,
});
const Photo_chunks = mongoose.model("photos.chunks", PhotoChunks);
module.exports = Photo_chunks;
