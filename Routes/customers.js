const { generateToken, authenticateToken } = require('../auth/jwt');

module.exports = (customer, knex) => {

    // Register a customer by using post
    customer.post('/customer', (req, res) => {
        knex
            .select('*')
            .from('customer')
            .where({ 'name': req.body.name, 'email': req.body.email, 'password': req.body.password })
            .then((data) => {
                if (data.length < 1) {
                    knex('customer').insert(req.body)
                        .then((data) => {
                            console.log('Signup successfully\n data ', data)
                            res.send({ message: 'Signup successfully' })
                        }).catch((err) => {
                            console.log({ err: err.message })
                            res.send({ err: err.message })
                        })
                } else {
                    console.log({ 'Message': 'The user is already exits in customer table' })
                    re.send({ 'Message': 'The user is already exits in customer table' })
                }
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // Login a customer by using post 
    customer.post('/customer/login', (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        if (email === undefined && password === undefined) {
            console.log({ "Message": "email and password both are require!" })
            res.send({ "Message": "email and password both are require!" })
        } else {
            knex.select('*')
                .from('customer')
                .where("email", email)
                .where("password", password)
                .then((data) => {
                    if (data.length > 0) {
                        var userdata = { name: data[0].name, customer_id: data[0].customer_id }
                        var accessToken = generateToken(userdata)
                        console.log('User_Token=> ', accessToken);
                        res.cookie("key", accessToken)
                        delete data[0].password;
                        console.log(data);
                        res.send({ 'user': data })
                    } else {
                        res.send({ "Error": "This user doesn't exists! please Signup....." })
                    }
                }).catch((err) => {
                    console.log({ err: err.message })
                    res.send({ err: err.message })
                })
        }
    });

    //Update a customer by using put
    customer.put('/customer', authenticateToken, (req, res) => {
        knex('customer')
            .update(req.body)
            .where('email', req.body.email)
            .then((data) => {
                console.log({ 'User_data': data })
                res.send({ "Done": "data updated successfully!" })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })

    });

    // get acustomer data
    customer.get("/customer", authenticateToken, (req, res) => {
        knex
            .select('*')
            .from('customer')
            .then((data) => {
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    //Update a customer address by using put
    customer.put('/customer/address', authenticateToken, (req, res) => {
        console.log(req.body)
        knex('customer')
            .update({
                'address_1': req.body.address_1,
                'address_2': req.body.address_2,
                'city': req.body.city,
                'region': req.body.region,
                'postal_code': req.body.postal_code,
                'country': req.body.country,
                'shipping_region_id': req.body.shipping_region_id
            })
            .where('customer_id', req.body.customer_id)
            .then((data) => {
                console.log({ 'User_data': data })
                res.send({ "Done": "data updated successfully!" })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    //Update a customer creditCard by using put
    customer.put('/customers/creditCard', authenticateToken, (req, res) => {
        console.log(req.body)
        knex('customer')
            .update({
                'credit_card': req.body.credit_card
            })
            .where('customer_id', req.body.customer_id)
            .then((data) => {
                console.log({ 'User_data': data })
                res.send({ "Done": "data updated successfully!" })
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });
}