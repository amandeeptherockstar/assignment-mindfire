const express = require('express');
const Product = require('../../models/Product/Product');
const Transaction = require('../../models/Transaction/Transaction');

const router = express.Router();

router.get('/transactions', async (req, res) => {
  const resp = await Transaction.find({}).sort({  transation_date_time: 'desc' }).populate('customer_id').populate('product_id');
  res.json({transations: resp});
});

router.delete('/remove_all', async (req, res) => {
  const resp = await Transaction.deleteMany({});
  res.json({transations: resp});
  // reset the booked quantity to 0 as well for Products Model
  const response = await Product.updateMany({}, { $set: {
    quantity_booked: 0,
  } });
});

router.get('/transaction/:id', async(req, res) => {
  // get single transaction based on customer id and book id
  // because its for edit transaction
  const resp = await Transaction.findOne({ _id: req.params.id }).populate('product_id').populate('customer_id');
  res.json({ transaction: resp });
});

router.post('/transaction', async (req, res) => {
  const prod = new Transaction({
    // explicitly You can generate the object id like this
    customer_id: req.body.customerId,
    product_id: req.body.productId,
    transation_type: req.body.transationType,
    quantity: req.body.quantity,
    transation_id_parent: req.body.parentTransaction || null,
  });
  const resp = await prod.save();
  res.json({product: resp});
  // update the quantity in the main inventory Products Model too behind the scene
  const product = await Product.findOne({ _id: req.body.productId });
  const updated = {
    quantity_booked: product.quantity_booked + +req.body.quantity,
    product_title: product.product_title,
    quantity_total: product.quantity_total,
    price: product.price,
  };
  const updatedOne = await Product.updateOne({_id: req.body.productId}, { $set: updated });
  // Product.updateOne({_id: req.body.productId}, { $set: {
  //   quantity_booked: product.quantity_booked + +req.body.quantity
  // } });
  // const updatedOne = await Product.updateOne({_id: req.body.productId}, updated);

});

// create a new transaction
router.put('/transaction/:id', async (req, res) => {
  const trans = await new Transaction({
    customer_id: req.body.customerId,
    product_id: req.body.productId,
    transation_type: 'IN',
    quantity: req.body.quantity,
    transation_id_parent: req.params.id || null,
  });
  const resp = trans.save();
  // const trans = await Transaction.findOneAndUpdate({_id: req.params.id}, {
  //   transation_type: 'IN',
  //   transation_id_parent: req.body.parentTransactionId,
  // });
  const transaction = await Transaction.findOne({ _id: req.params.id });
  const updatedTransaction = {
    customer_id: transaction.customer_id,
    product_id: transaction.product_id,
    quantity: transaction.quantity,
    transation_type: transaction.transation_type,
    transation_id_parent: req.params.id,
  };
  const tres = await Transaction.updateOne({_id: req.params.id}, {$set: updatedTransaction})
  res.json({transaction: resp});
  // update the quantity in the inventory back to Products Model behind the scene
  // const product = await Product.findOne({ _id: req.body.productId });
  // const updated = {
  //   // as we are returning so, subtract the quantity from the quantity booked
  //   quantity_booked: product.quantity_booked - +req.body.quantity,
  //   product_title: product.product_title,
  //   quantity_total: product.quantity_total,
  //   price: product.price,
  // }
  const product = await Product.findOne({_id: req.body.productId});
  const updatedProduct = {
    product_title: product.product_title,
    quantity_total: product.quantity_total,
    quantity_booked: product.quantity_booked - +req.body.quantity,
    price: product.price,
  }
  const pres = await Product.updateOne({ _id: req.body.productId }, {$set: updatedProduct});
});

module.exports = router;