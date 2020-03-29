const express = require('express');

const router = express.Router();

const Customer = require('../../models/Customer/Customer');
const Transaction = require('../../models/Transaction/Transaction');
const customers = require('../../Data/customers.json');

router.get('/load_customers', async (req, res) => {
  const count = await Customer.countDocuments();
  if(count <= 0) {
    await Customer.create(customers);
    const custs = await Customer.find({}).sort({  customer_name: 'asc' });
    return res.json({customers: custs});  
  }
  const custs = await Customer.find({}).sort({  customer_name: 'asc' });
  res.json({ customers: custs });
});

router.get('/customers', async (req, res) => {
  const resp = await Customer.find({}).sort({  customer_name: 'asc' });
  res.json({customers: resp});
});

router.post('/customer', async (req, res) => {
  const cust = new Customer({
    customer_name: req.body.name,
  });
  const resp = await cust.save();
  res.json({customer: resp});
})

router.delete('/customers', async (req, res) => {
  const resp = await Customer.deleteMany({});
  res.json({customers: resp});
  // delete transactions too 
  Transaction.deleteMany({});
});

module.exports = router;