const mysql = require("mysql");
require('dotenv').config()

var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_DATA,
    password: process.env.PASS
})

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("database connected....")
    }
})

var knex = require('knex')({
    client: "mysql",
    connection: {
        host: process.env.HOST,
        user: process.env.USER_DATA,
        password: process.env.PASS,
        database: process.env.DB_DATA
    }
})

module.exports = knex;