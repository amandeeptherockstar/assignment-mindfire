const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  transation_id: {
    type: Schema.Types.ObjectId,
  },
  transation_date_time: {
    type: Date,
    default: Date.now,
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  transation_type: {
    type: String,
    enum: ['IN', 'OUT'],
    required: true,
    default: 'OUT', // out refers to booked, in refers to returned
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  transation_id_parent: {
    type: Schema.Types.ObjectId,
    ref: 'Transation',
  }
});

const TransactionModel = mongoose.model('Transation', TransactionSchema);
module.exports = TransactionModel;