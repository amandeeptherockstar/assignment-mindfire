const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

const ProductsRoute = require('./routes/products/products');
const CustomersRoute = require('./routes/customers/customers');
const TransactionsRoute = require('./routes/transactions/trasnactions');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://mindfire:mindfire@cluster0-hbslw.mongodb.net/tenthouse?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(response => {
  console.log('Mongoose Connected With MongoDB Atlas');
}).catch(err => {
  console.log('Failed to Connect with MongoDB Atlas');
})



app.use('/products', ProductsRoute);
app.use('/customers', CustomersRoute);
app.use('/transactions', TransactionsRoute);




const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${server.address().port}`);
});