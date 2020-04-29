const mysql = require('mysql')
const chalk = require('chalk')


/**
 * CONNECTION
 */
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'amber1995',
    database: 'projectv2'
})
connection.connect(error => {
    if (error) {
        throw new Error('Error connecting to the database', error.stack)
    }
    console.log(chalk.green.inverse(`Connected to database: ${connection.threadId}`))
})

// const databaseConn = (callback) => {
//     const connection = mysql.createConnection({
//         host: '127.0.0.1',
//         user: 'root',
//         password: 'amber1995',
//         database: 'projectv2'
//     })
//     connection.connect(error => {
//         if (error) {
//             throw new Error('Error connecting to the database', error.stack)
//         }
//         console.log(chalk.green.inverse(`Connected to database: ${connection.threadId}`))
//     })
//
//     callback(connection)
//     connection.end()
// }



/***
 * TABLE CREATION IF NOT COMPLETED
 */
// Budget table
const createTableSQL = `CREATE TABLE IF NOT EXISTS budget(
                    budget_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
                    budget_type ENUM('inc', 'exp', 'sav') NOT NULL,
                    budget_description VARCHAR(30) NOT NULL, 
                    budget_value INT NOT NULL, 
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    deleted_at DATETIME
                );`

connection  .query(createTableSQL, (error) => {
    if (error) {
        throw new Error(error)
    }
})
connection.query('SELECT * FROM budget where budget_id = 5', (error, results, fields) => {
    // console.log(fields)
    // console.log(results[0])
})




module.exports = connection

