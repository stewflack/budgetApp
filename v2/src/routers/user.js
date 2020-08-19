const mysql = require('mysql');
const bcrypt = require('bcryptjs')
const express = require('express')
const auth = require('../middleware/auth')
const { ValidateUser, generateAuthToken, comparePassword } = require('../js/Users')
const {queryUpdate, queryPromise} = require('../db/databaseMethods')
const router = new express.Router()


/** CREATE USER **/
router.post('/users', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Please provide only the name, email and password.'
        });
    }
    try {
        const [error, user] = await ValidateUser(req.body) // returns error if any and object
        if (error) {
            return res.status(400).send({
                error
            })
        }
        const id = await queryUpdate('INSERT INTO users SET ?', user)
        /*** User Authentication Token Generated ***/

        const token = await generateAuthToken(id.insertId)
        // request.headers.authorization = token;
        res.status(201).send({user, token})

    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({
                error: 'Email address already in use.'
            })
        }
        res.status(500).send(e)
        res.end();
    }
    res.end();
})

router.get('/users/test', auth, async (req, res) => {
    try {
        console.log(req.user)
    } catch (e) {
        res.send(e)
    }
})

/** GET USER **/
router.get('/users/profile', auth, async (req, res) => {
    try {
        const id = req.user
        console.log(id)
        const user = await queryPromise(`Select * from users where id = ${id} and deleted_at is null`)

        res.send(user)
        res.end();
    } catch (e) {
        return res.status(500).send(e)
    }
})

/** UPDATE USER **/
router.patch('/users/profile', auth, async (req, res) => {
    const id = req.user
    /** Ensures that only the name email and password are allowed to be entered **/
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Please provide only the name, email and password.' })

    try {

        const [error, user] = await ValidateUser(req.body)
        if (error) {
            return res.status(400).send({
                error
            })
        }

        await queryUpdate(`Update users set ? where id = ${id}`, user)

        res.send(user)
        res.end();
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({
                error: 'Email address already in use.'
            })
        }
        res.status(500).send(e)
        res.end();
    }
})

/** DELETE USER **/
router.delete('/users/profile', auth, async (req, res) => {
    const id = req.user
    try {
        await queryUpdate(`DELETE FROM users WHERE id = ?`, id)

        res.send({
            message: `User ${id} has been deleted.`
        })
        res.end();
    } catch (e) {
        res.status(500).send({
            e,
            id
        })
        res.end();
    }

})

/** LOGIN USER **/
router.post('/users/login', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Please provide your email and password.'
        })
    }
    try {
        // Find user in the database 
        const userSearch = await queryUpdate(`select * from users where user_email = ?`, req.body.email)
        // compare password entered to one in the database
        const user = userSearch[0]
        const match = await comparePassword(req.body.password, user.user_password)
        if (!match) {
            return res.status(400).send({
                error: 'Password wrong.'
            })
        }
        // Generate auth token
        const token = await generateAuthToken(user.id)
        // set user session as token 

        // redirect to /my-budget 
        // TODO - for this to work I need to re do the auth middleware to check the session token = something within the database 

        res.status(200).send({
            userName: user.user_name,
            userEmail: user.user_email,
            token
        })
        res.end();
    } catch (e) {
        res.status(400).send({
            error: e
        })
        res.end();
    }
})

router.get('/users/login',  (req, res) => { 

})

module.exports = router