
const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },

  title:{
    type: String,
    required:true
  },

  text: {
    type: String,
    required: true,
  },

  category: {
    type: Array,
    required: true,
  },

  image : {
    type : String,
    required : true,
  }

});

const NewsArticle = new mongoose.model('globals', newsSchema)

module.exports = NewsArticle;



