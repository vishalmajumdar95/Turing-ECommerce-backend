const random = require('randomstring')

module.exports = (shoppingcart, knex) => {

    // generate the unique CART ID
    shoppingcart.get('/shoppingcart/generateUniqueId', async(req, res) => {
        const cart_id = random.generate({
            charset: "alphanumeric"
        })
        console.log({ "It's is your cart_id": cart_id })
        res.send({ "It's is your cart_id": cart_id })

    })

    // Add the product in the CART
    shoppingcart.post('/shoppingcart/add', (req, res) => {
        knex.select('quantity')
            .from('shopping_cart')
            .where('shopping_cart.cart_id', req.body.cart_id)
            .andWhere('shopping_cart.product_id', req.body.product_id)
            .andWhere('shopping_cart.attributes', req.body.attributes)
            .then((data) => {
                if (data.length == 0) {
                    knex('shopping_cart')
                        .insert({
                            'cart_id': req.body.cart_id,
                            'product_id': req.body.product_id,
                            'attributes': req.body.attributes,
                            'quantity': 1,
                            'added_on': new Date()
                        })
                        .then(() => {
                            knex
                                .select(
                                    'item_id',
                                    'name',
                                    'attributes',
                                    'shopping_cart.product_id',
                                    'price',
                                    'quantity',
                                    'image'
                                )
                                .from('shopping_cart')
                                .join('product', function() {
                                    this.on('shopping_cart.product_id', 'product.product_id')
                                })
                                .then(data => {

                                    let datas = []
                                    for (let i of data) {
                                        let subtotal = i.price * i.quantity;
                                        i.subtotal = subtotal;
                                        // console.log(i);
                                        datas.push(i);
                                    }
                                    console.log({ 'user_data': data })
                                    res.send({ 'user_data': data });
                                }).catch((err) => {
                                    console.log({ err: err.message })
                                    res.send({ err: err.message })
                                })
                        }).catch((err) => {
                            console.log({ err: err.message })
                            res.send({ err: err.message })
                        })
                } else {
                    console.log({ message: "The user is already exits.." })
                    res.send({ message: "The user is already exits.." })
                }
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Get List of Products in Shopping Cart
    shoppingcart.get('/shoppingcart/:cart_id', (req, res) => {
        knex.select('item_id', 'name', 'attributes', 'shopping_cart.product_id',
                'price',
                'quantity',
                'image').from('shopping_cart').join('product', function() {
                this.on('shopping_cart.product_id', 'product.product_id')
            }).where('shopping_cart.cart_id', req.params.cart_id)
            .then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log(err)
            })
    })

    // Update the cart by item
    shoppingcart.put('/shoppingcart/update/:item_id', (req, res) => {
        const item_id = req.params.item_id;
        knex('shopping_cart')
            .where('item_id', item_id)
            .update({
                quantity: req.body.quantity
            }).then((data) => {
                console.log({ message: data })
                knex
                    .select('item_id',
                        'product.name',
                        'shopping_cart.attributes',
                        'shopping_cart.product_id',
                        'product.price',
                        'shopping_cart.quantity',
                        'product.image')
                    .from('shopping_cart')
                    .join('product', function() {
                        this.on('shopping_cart.product_id', 'product.product_id')
                    }).where('item_id', item_id)
                    .then((data) => {
                        console.log({ 'User_data': data })
                        res.send({ "User_data": data })
                    }).catch((err) => {
                        console.log({ err: err.message })
                        res.send({ err: err.message })
                    })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Empty cart
    shoppingcart.delete('/shoppingcart/empty/:cart_id', (req, res) => {
        const cart_id = req.params.cart_id;
        knex('shopping_cart')
            .where('cart_id', cart_id)
            .del()
            .then((data) => {
                console.log({ message: data })
                res.send({ message: "delete seccesfully....." })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Return a total amount from Cart
    shoppingcart.get('/shoppingcart/totalAmount/:cart_id', (req, res) => {
        knex
            .select('price', 'quantity').from('shopping_cart')
            .join('product', function() {
                this.on('shopping_cart.product_id', 'product.product_id')
            })
            .where('shopping_cart.cart_id', req.params.cart_id)
            .then((data) => {
                console.log(data)
                let dic = {}
                let a = data[0].price * data[0].quantity
                dic.totalAmount = a
                res.send(dic)
                console.log(dic)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Save a Product for latter
    shoppingcart.get('/shoppingcart/savedForLater/:item_id', (req, res) => {
        knex.schema.createTable('later', function(table) {
            table.increments('item_id').primary();
            table.string('cart_id');
            table.integer('product_id');
            table.string('attributes');
            table.integer('quantity');
            table.integer('buy_now');
            table.datetime('added_on');
        }).then(() => {
            console.log("later table created successfully....")
        }).catch(() => {
            console.log("later table is already exists!");
        })
        knex
            .select("*")
            .from('shopping_cart')
            .where('item_id', req.params.item_id)
            .then((data) => {
                knex('later')
                    .insert(data[0])
                    .then((data2) => {
                        console.log(data2)
                        knex
                            .select("*")
                            .from('shopping_cart')
                            .where('item_id', req.params.item_id)
                            .del()
                            .then((data3) => {
                                console.log(data3)
                                res.send({ message: 'data move from shopping cart to save for later' })
                            }).catch((err) => {
                                console.log({ err: err.message })
                                res.send({ err: err.message })
                            })

                    }).catch((err) => {
                        res.send({ err: err.message })
                    })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Move a product to cart
    // First create a table "cart"
    shoppingcart.get('/shoppingcart/movetocart/:item_id', (req, res) => {
        knex.schema.createTable('cart', function(table) {
            table.increments('item_id').primary();
            table.string('cart_id');
            table.integer('product_id');
            table.string('attributes');
            table.integer('quantity');
            table.integer('buy_now');
            table.datetime('added_on');
        }).then(() => {
            console.log("cart table created successfully....")
        }).catch(() => {
            console.log("cart table is already exists!");
        })

        knex
            .select('*')
            .from('later')
            .where('item_id', req.params.item_id)
            .then((data) => {
                console.log(data);
                if (data.length > 0) {
                    knex('cart')
                        .insert(data[0])
                        .then((result) => {
                            console.log(result)
                            knex
                                .select('*')
                                .from('later')
                                .where('item_id', req.params.item_id)
                                .delete()
                                .then((done) => {
                                    res.send({ "Good": "data move from later to cart successfully!" })
                                })
                        }).catch((err) => {
                            console.log({ err: err.message })
                            res.send({ err: err.message })
                        })

                } else {
                    res.send({ "Error": "this id is not available in shopping_cart" })
                }

            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Get Products saved for latter
    shoppingcart.get('/shoppingcart/getSaved/:cart_id', (req, res) => {
        knex
            .select(
                'item_id',
                'product.name',
                'shopping_cart.attributes',
                'product.price').from('shopping_cart')
            .join('product', function() {
                this.on('shopping_cart.product_id', 'product.product_id')
            })
            .where('shopping_cart.cart_id', req.params.cart_id)
            .then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })

    // Remove a product in the cart
    shoppingcart.delete('/shoppingcart/removedProduct/:item_id', (req, res) => {
        knex
            .select('*')
            .from('shopping_cart')
            .where('item_id', req.params.item_id)
            .del()
            .then((data) => {
                console.log({ message: 'product removed successfully from shopping cart' })
                res.send({ message: 'product removed successfully from shopping cart' })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    })
}