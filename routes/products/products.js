const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../../models/Product/Product');
const Transaction = require('../../models/Transaction/Transaction');
const products = require('../../Data/products.json');

router.get('/load_products', async (req, res) => {
  const count = await Product.countDocuments();
  if(count <= 0) {
    await Product.create(products);
    const prods = await Product.find({}).sort({  product_title: 'asc' });
    return res.json({products: prods});  
  }
  const prods = await Product.find({}).sort({  product_title: 'asc' });
  res.json({ products: prods });
});

router.get('/products', async (req, res) => {
  const resp = await Product.find({}).sort({  product_title: 'asc' });
  res.json({products: resp});
});

router.post('/product', async (req, res) => {
  const prod = new Product({
    // explicitly You can generate the object id like this
    product_id: mongoose.Types.ObjectId(),
    product_title: req.body.title,
    quantity_total: req.body.total,
    price: req.body.price,
  });
  const resp = await prod.save();
  res.json({product: resp});
});

router.delete('/products', async (req, res) => {
  const resp = await Product.deleteMany({});
  res.json({products: resp});
  // delete transactions
  Transaction.deleteMany({});
});

module.exports = router;