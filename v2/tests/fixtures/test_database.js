const mysql = require('mysql')
const chalk = require('chalk')


/**
 * CONNECTION
 */
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'amber1995',
    database: 'projectv2-test'
})

/***
 * TABLE CREATION IF NOT COMPLETED
 */
// Budget table
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

const createUsersTable = `create TABLE if not exists users(
                            id int primary key auto_increment, 
                            user_name VARCHAR(30) not null, 
                            user_email VARCHAR(50) not null, 
                            user_password VARCHAR(50) not null,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            deleted_at DATETIME )`

const createTokensTable = `create TABLE if not exists tokens(
                            token_id int primary key auto_increment not null,
                            user_id int not null,
                            token varchar(500) not null,
                            FOREIGN KEY (user_id) REFERENCES users(id))`


const setUpDatabase = async () => {
    // Not in try and catch, if the tables are not there I dont want this to fail
    connection.query(`DELETE FROM budget`, (error) => {
        if (error) {
            throw new Error(error)
        }
    })
    connection.query(`DELETE FROM users`, (error) => {
        if (error) {
            throw new Error(error)
        }
    })
    connection.query(`DELETE FROM tokens`, (error) => {
        if (error) {
            throw new Error(error)
        }
    })

    connection.query(createTableSQL, (error) => {
        if (error) {
            throw new Error(error)
        }
    })
    connection.query(createUsersTable, (error) => {
        if (error) {
            throw new Error(error)
        }
    })
    connection.query(createTokensTable, (error) => {
        if (error) {
            throw new Error(error)
        }
    })

}

const closeConnection = () => {
    connection.end()
}


module.exports = {
    setUpDatabase,
    closeConnection
}

