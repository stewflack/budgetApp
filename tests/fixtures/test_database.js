const chalk = require('chalk')
const bcrypt = require('bcryptjs')

const connection = require('../../src/db/connection')
const {queryPromise ,queryUpdate} = require('../../src/db/databaseMethods')
const {generateAuthToken} = require('../../src/js/Users')
/**
 * CONNECTION
 */


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

const userobj = {
    user_name:process.env.TEST_USER_NAME,
    user_email:process.env.TEST_USER_EMAIL,
    user_password:bcrypt.hash(process.env.TEST_USER_PASSWORD, 8)
}



const setUpDatabase = async () => {
    // Not in try and catch, if the tables are not there I dont want this to fail
    try {
        await queryPromise(createTableSQL)
        await queryPromise(createUsersTable)
        await queryPromise(createTokensTable)
        userobj.id = 1
        const id = await queryUpdate('INSERT INTO users SET ?', userobj)
        // Generate an auth token from this, put into the env file and then on each insert put that one in,
        // that way we already know what the token will be
        // 1. generate auth token from jwt - eyJhbGciOiJIUzI1NiJ9.MQ.3UAnh0RRao5j-p-rtvmXpJA71Ps7Wh93hNLUl9BT2dg
        // 2. put into the env file
        // 3. remove code that generated the token
        // 4. insert user into the database
        // 5. insert the token created in env into the database
        // 6. do the profile user test, attaching Bearer process.env.TEST_USER_TOKEN
        // await generateAuthToken(id.insertId)
        const objToSend = {
            user_id: userobj.id,
            token: process.env.TEST_USER_TOKEN
        }
        await queryUpdate(`Insert into tokens set ?`, objToSend)
    } catch (e) {
        throw new Error(e)
    }
}

const clearDatabase = async () => {
    await queryPromise(`DELETE FROM budget`)
    await queryPromise(`DELETE FROM tokens`)
    await queryPromise(`DELETE FROM users`)
}

const closeConnection = () => {
    connection.end()
}

module.exports = {
    setUpDatabase,
    closeConnection,
    clearDatabase
}

