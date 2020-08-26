const mysql = require('mysql');

const connection = mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB

    host: '127.0.0.1',
    user: 'root',
    password: 'amber1995',
    database: 'projectv2',
    port: 3306
})



module.exports = connection