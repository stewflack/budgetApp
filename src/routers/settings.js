// settings and budget types endpoints (for now) will be located here 

const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const {} = require('../js/BudgetTypes');
const { queryUpdate , queryPromise} = require('../db/databaseMethods');
const { json } = require('express');

/***
 * Settings 
 */
router.get('/settings', auth, (req, res) => {


});

/****
 * Budget Types 
 */
router.get('/types', async (req, res) => {

    const types = await queryUpdate(`select * from budget_types where user_id = ?`, 105);

    res.send(types);

});

router.get('/types/:id', async (req, res) => {
    const id = req.params.id;
    const type = await queryUpdate(`select * from budget_types where user_id = ? AND id = ?`, [105, 1]);
    res.send(type);
}); 

router.post('/types', auth, (req, res) => {

});


router.patch('/types', auth, (req, res) => {

});

module.exports = router;