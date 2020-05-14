const express = require('express')

const { ValidateUser } = require('../js/Users')
const router = new express.Router()


/** CREATE USER **/
router.post('/users', async (req, res) => {
    const [error, user] = await ValidateUser(req.body) // returns error if any and object
    if (error) {
        res.status(400).send({
            error
        })
    }
    res.send(user)
})

/** GET USER **/
router.get('/users/:id', (req, res) => {

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