const mongoose = require('mongoose');
const shortid = require('shortid');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    default: shortid.generate(),
  },
  description: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
});

const Product =
  mongoose.models.product || mongoose.model('product', productSchema);

module.exports = Product;
