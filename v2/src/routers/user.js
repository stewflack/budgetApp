const express = require('express')

const { ValidateUser } = require('../js/Users')
const {queryUpdate, queryPromise} = require('../db/databaseMethods')
const router = new express.Router()


/** CREATE USER **/
router.post('/users', async (req, res) => {
    try {
        const [error, user] = await ValidateUser(req.body) // returns error if any and object
        if (error) {
            res.status(400).send({
                error
            })
        }
        await queryUpdate('INSERT INTO users SET ?', user)

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

/** GET USER **/
router.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id

        const user = await queryPromise(`Select * from users where id = ${id} and deleted_at is null`)

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

/** UPDATE USER **/
router.patch('/users/:id', (req, res) => {

})

/** DELETE USER **/
router.delete('/users/:id', (req, res) => {

})

/** LOGIN USER **/
router.post('/users/login', (req, res) => {

})

module.exports = router