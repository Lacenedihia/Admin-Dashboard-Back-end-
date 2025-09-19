const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articlesCategorySchema = new Schema({
    category: {
        type: String,
    },

});
const ArticlesCategory = mongoose.model("ArticlesCategory", articlesCategorySchema);
module.exports = ArticlesCategory;
