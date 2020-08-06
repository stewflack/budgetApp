const chalk = require('chalk')
const connection = require('./connection')

/**
 * CONNECTION
 */

connection.connect(error => {
    if (error) {
        throw new Error('Error connecting to the database' + error)
    }
    console.log(chalk.green.inverse(`Connected to database: ${connection.threadId}`))
})

/***
 * TABLE CREATION IF NOT COMPLETED
 */
// Budget table
const createUsersTable = `create TABLE if not exists users(
                                                              id int primary key auto_increment,
                                                              user_name VARCHAR(30) not null,
                                                              user_email VARCHAR(50) not null,
                                                              user_password VARCHAR(50) not null,
                                                              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                              deleted_at DATETIME )`

const createTableSQL = `CREATE TABLE IF NOT EXISTS budget(
                    budget_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
                    budget_type ENUM('inc', 'exp', 'sav') NOT NULL,
                    budget_description VARCHAR(30) NOT NULL, 
                    budget_value INT NOT NULL,
                    user_id int not null,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    deleted_at DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );`



const createTokensTable = `create TABLE if not exists tokens(
                            token_id int primary key auto_increment not null,
                            user_id int not null,
                            token varchar(500) not null,
                            FOREIGN KEY (user_id) REFERENCES users(id))`
connection.query(createUsersTable, (error) => {
    if (error) {
        throw new Error(error)
    }
})
connection.query(createTableSQL, (error) => {
    if (error) {
        throw new Error(error)
    }
})



connection.query(createTokensTable, (error) => {
    if (error) {
        throw new Error(error)
    }
})
connection.query('SELECT * FROM budget where budget_id = 5', (error, results, fields) => {
    // console.log(fields)
    // console.log(results[0])
})




module.exports = connection

