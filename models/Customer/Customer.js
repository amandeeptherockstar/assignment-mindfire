const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  customer_id: {
    type: Schema.Types.ObjectId,
  },
  customer_name: {
    type: String,
    required: true,
  },
});

const CustomerModel = mongoose.model('Customer', CustomerSchema);
module.exports = CustomerModel;