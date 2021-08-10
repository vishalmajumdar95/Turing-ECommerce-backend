const { authenticateToken, generateToken } = require("../auth/jwt");

module.exports = (orders, knex) => {

    // Create a Order
    orders.post('/orders', authenticateToken, (req, res) => {
        knex
            .select("*")
            .from("shopping_cart")
            .where("cart_id", req.body.cart_id)
            .join("product", function() {
                this.on('shopping_cart.product_id', 'product.product_id')
            })

        .then((data) => {
            knex("orders").insert({
                    "total_amount": data[0].quantity * data[0].price,
                    "created_on": new Date(),
                    "shipping_id": req.body.shipping_id,
                    "tax_id": req.body.tax_id
                }).then((result) => {
                    knex("order_detail")
                        .insert({
                            "unit_cost": data[0].price,
                            "quantity": data[0].quantity,
                            "product_name": data[0].name,
                            "attributes": data[0].attributes,
                            "product_id": data[0].product_id,
                            "order_id": result[0]
                        })
                        .then((inserting_data) => {
                            console.log(inserting_data)
                        }).catch((err) => {
                            console.log(err)
                            res.send({ error: err.message })
                        })
                })
                .then((detail) => {
                    knex.select("*").from("shopping_cart").where("cart_id", req.body.cart_id).delete()
                        .then(() => {
                            res.send({ "order Id": "orders successfully" })
                        }).catch((err) => {
                            console.log(err)
                            res.send({ error: err.message })
                        })
                }).catch(() => {
                    console.log(err)
                    res.send({ error: err.message })
                })
        }).catch((err) => {
            console.log(err)
            res.send({ error: err.message })
        })
    });

    // Get info about Order
    orders.get('/orders/:order_id', authenticateToken, (req, res) => {
        knex.select('orders.order_id',
                'product.product_id',
                'order_detail.attributes',
                'product.name as product_name',
                'order_detail.quantity',
                'product.price',
                'order_detail.unit_cost').from('orders')
            .join('order_detail', function() {
                this.on('orders.order_id', 'order_detail.order_id')
            }).join('product', function() {
                this.on('order_detail.product_id', 'product.product_id')
            }).where('orders.order_id', req.params.order_id)
            .then((data) => {
                res.send(data)
            }).catch((err) => {
                res.send({ err: err.message })
            })
    });


    // Get shortDetails about orders
    orders.get('/orders/shortdetail/:order_id', authenticateToken, (req, res) => {
        const order_id = req.params.order_id;
        knex
            .select('order_id', 'total_amount', "created_on",
                "shipped_on", "status", 'product.name')
            .from('orders')
            .join('product', function() {
                this.on('orders.order_id', 'product.product_id')
            }).where('orders.order_id', order_id)
            .then((data) => {
                console.log(data)
                res.send(data)
            })
            .catch((err) => {
                console.log(err)
                res.send({ err: err.message })
            })
    });

    // Get orders by customer
    orders.get('/orders/inCustomer/user_data', authenticateToken, (req, res) => {
        var customer_id = req.data.customer_id
        knex.select('*')
            .from('customer')
            .where('customer_id', customer_id)
            .then((data) => {
                console.log(data)
                res.send(data)
            })
            .catch((err) => {
                console.log(err)
                res.send({ err: err.message })
            })
    })
}