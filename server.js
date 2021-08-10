const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json())
require('dotenv').config();

// knex connection
const knex = require('./database/turingdb')


const department = express.Router();
app.use("/", department);
require("./Routes/departments")(department, knex);


// route to attribute.js
const attribute = express.Router();
app.use("/", attribute);
require("./Routes/attributes")(attribute, knex);


// route to categories.js
const category = express.Router();
app.use("/", category);
require("./Routes/categories")(category, knex);


// route to product.js
const product = express.Router();
app.use("/", product);
require("./Routes/products")(product, knex);


// route to tax.js
const tax = express.Router();
app.use("/", tax);
require("./Routes/tax")(tax, knex)


// route to Shipping.js
const shipping = express.Router();
app.use("/", shipping);
require("./Routes/shipping")(shipping, knex)


// route to customer.js
const customer = express.Router();
app.use("/", customer);
require("./Routes/customers")(customer, knex);


// route to orders.js
const orders = express.Router();
app.use("/", orders);
require("./Routes/orders")(orders, knex);


// route to shoppingcart.js
const shoppingcart = express.Router();
app.use("/", shoppingcart);
require("./Routes/shoppingcart")(shoppingcart, knex);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const PORT = process.env.PORT || 2022

// the port listener
var server = app.listen(PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log(host, port);
    console.log("Server is Successfully running......!")
});