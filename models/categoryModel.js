const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  discountPercentage:{
    type:Number,
    default:0
  },
  deleted:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('category',categorySchema) 