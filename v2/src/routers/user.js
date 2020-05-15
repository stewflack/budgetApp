const express = require('express')

const { ValidateUser } = require('../js/Users')
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
        })
    }
    try {
        const [error, user] = await ValidateUser(req.body) // returns error if any and object
        if (error) {
            return res.status(400).send({
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
router.patch('/users/:id', async (req, res) => {
    const id = req.params.id
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

    } catch (e) {
        res.status(500).send(e)
    }
})

/** DELETE USER **/
router.delete('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
        await queryUpdate(`DELETE FROM users WHERE id = ?`, id)

        res.send({
            message: `User ${id} has been deleted.`
        })
    } catch (e) {
        res.status(500).send(e)

    }

})

/** LOGIN USER **/
router.post('/users/login', (req, res) => {

})

module.exports = router