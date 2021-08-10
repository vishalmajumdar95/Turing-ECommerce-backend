module.exports = (product, knex) => {

    // get all products
    product.get("/product", (req, res) => {
        knex
            .select('*')
            .from('product')
            .then((data) => {
                console.log(data)
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // search products
    product.get("/product/search", (req, res) => {
        const search = req.query.search;
        knex
            .select('product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail')
            .from('product')
            .where('name', 'like', '%' + search + '%')
            .orWhere('description', 'like', '%' + search + '%')
            .orWhere('product_id', 'like', '%' + search + '%')
            .then((data) => {
                console.log("data sent by search!/n", data)
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // get product by id
    product.get("/product/:product_id", (req, res) => {
        const product_id = req.params.product_id;
        knex
            .select('*')
            .from('product')
            .where('product_id', product_id)
            .then((data) => {
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // get a list of products of categories
    product.get("/product/inCategory/:category_id", (req, res) => {
        const category_id = req.params.category_id;
        knex
            .select('product.product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail')
            .from('product')
            .join('product_category', function() {
                this.on('product.product_id', 'product_category.product_id')
            })
            .where('product.product_id', category_id)
            .then((data) => {
                console.log(data)
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // Get a list of products on department
    product.get("/product/inDepartment/:department_id", (req, res) => {
        const department_id = req.params.department_id;
        knex
            .select('product.product_id', 'product.name', 'product.description', 'product.price', 'product.discounted_price', 'product.thumbnail')
            .from('product')
            .join('product_category', function() {
                this.on('product.product_id', 'product_category.product_id')
            })
            .join('category', function() {
                this.on('product_category.category_id', 'category.category_id')
            })
            .join('department', function() {
                this.on('category.department_id', 'department.department_id')
            })
            .where('department.department_id', department_id)
            .then((data) => {
                console.log(data)
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // get details of a product
    product.get("/product/:product_id/details", (req, res) => {
        const product_id = req.params.product_id;
        knex
            .select('product_id', 'name', 'description', 'price', 'discounted_price', 'image', 'image_2')
            .from('product')
            .where('product.product_id', product_id)
            .then((data) => {
                console.log(data)
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // get locations of a product
    product.get("/product/:product_id/locations", (req, res) => {
        const product_id = req.params.product_id;
        knex
            .select('category.category_id', 'category.name as category_name', 'category.department_id', 'department.name as department_name')
            .from('product')
            .join('product_category', function() {
                this.on('product.product_id', 'product_category.product_id')
            })
            .join('category', function() {
                this.on('product_category.category_id', 'category.category_id')
            })
            .join('department', function() {
                this.on('category.department_id', 'department.department_id')
            })
            .where('product.product_id', product_id)
            .then((data) => {
                console.log(data)
                res.send(data);
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // Get review of a product
    product.get("/product/:product_id/locations", (req, res) => {

    });

    // post reviews of a Product


};




























































































































































// const express = require('express')
// const product = express.Router()
// const knex = require('../database/turingdb')

// // get product data
// product.get('/products', (req, res) => {
//     knex.select('*').from('product').then((data) => {
//         console.log('data', data)
//         res.send(data)
//     }).catch((err) => {
//         console.log(err);
//         res.send(err)
//     })
// });

// // get search product
// product.get('/product/search', (req, res) => {
//     const search_products = req.query.search_products;
//     knex.select('product.product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail')
//         .from('product')
//         .where('name', 'like', '%' + search_products + '% ')
//         .orWhere('description', 'like', '%' + search_products + '%')
//         .then((data) => {
//             console.log('data sent by search! \n', data)
//             res.send(data)
//         }).catch((err) => {
//             console.log(err)
//             res.send(err)
//         })
// });


// // get product by product_id
// product.get('/product/:product_id', (req, res) => {
//     const product_id = req.params.product_id;
//     knex.select('*').from('product').where('product_id', product_id).then((data) => {
//         console.log('done', data)
//         res.send(data)
//     }).catch((err) => {
//         console.log(err)
//         res.send(err)
//     })
// });


// // get a list of products of categories
// product.get("/product/inCategory/:category_id", (req, res) => {
//     const category_id = req.params.category_id;
//     knex.select('product.product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail')
//         .from('product')
//         .join('product_category', function() {
//             this.on('product.product_id', 'product_category.product_id')
//         })
//         .where('product.product_id', category_id)
//         .then((data) => {
//             res.send(data);
//             console.log(data)
//         }).catch((err) => {
//             console.log(err);
//             res.send(err)
//         })
// });


// product.get("/product/inDepartment/:department_id", (req, res) => {
//     const category_id = req.params.category_id;
//     knex.select('product.product_id', 'product.name', 'product.description', 'product.price', 'product.discounted_price', 'product.thumbnail')
//         .from('product')
//         .join('product_category', function() {
//             this.on('product.product_id', 'product_category.product_id')
//         })
//         .join('category', function() {
//             this.on('product_category.category_id', 'category.category_id')
//         })
//         .join('department', function() {
//             this.on('category.department_id', 'department.department_id')
//         })
//         .join('')
//         .where('product.product_id', category_id)
//         .then((data) => {
//             res.send(data);
//             console.log(data)
//         }).catch((err) => {
//             console.log(err);
//             res.send(err)
//         })
// });

// module.exports = product;