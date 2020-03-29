const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
  },
  product_title: {
    type: String,
    required: true,
  },
  quantity_total: {
    type: Number,
  },
  quantity_booked: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  }
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;