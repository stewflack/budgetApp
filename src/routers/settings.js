// settings and budget types endpoints (for now) will be located here 

const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const {validateBudgetType} = require('../js/BudgetTypes');
const { queryUpdate , queryPromise} = require('../db/databaseMethods');
const { json } = require('express');

/***
 * Settings 
 */
router.get('/settings', (req, res) => {
    res.render('settings');
});

/****
 * Budget Types 
 */
router.get('/types', async (req, res) => {
    const types = await queryUpdate(`select id, type_name, colour from budget_types where user_id = ?`, 105);
    res.send(types);
});

router.get('/types/:id', async (req, res) => {
    const id = req.params.id;
    const type = await queryUpdate(`select * from budget_types where user_id = ? AND id = ?`, [105, id]);
    if (type.length === 0) {
        return res.status(400).send({
            error: 'No type found.'
        })
    }
    res.send(type);
}); 

router.post('/types', async (req, res) => {
    // takes 2 from body type_name, colour, then system sorts out the user_id and short_hand for database import
    const updates = Object.keys(req.body)
    const allowedUpdates = ['type_name', 'colour']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    try {
        if (!isValidOperation) {
            return res.status(400).send({
                error: 'Please provide only the budget type name and a colour.'
            });
        }
        req.body.user_id = 105; // update with when auth is back in 
        
        const [error, type] = await validateBudgetType(req.body);
    
        if (error) {
            return res.status(400).send({
                error
            })
        }
        
        const insert = await queryUpdate('INSERT INTO budget_types SET ?', type)
        type.id = insert.insertId;
        res.send(type);
    } catch(e) {
        return res.status(500).send({error: e})
    }
});


router.patch('/types/:id', async (req, res) => {
    const type_id = req.params.id;
    const body = req.body;
    try {
        const updates = Object.keys(body)
        const allowedUpdates = ['type_name', 'colour']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({
                error: 'Please provide only the budget type name and a colour.'
            });
        }
        body.user_id = 105;
    
        const [error, type] = await validateBudgetType(req.body);
        
        if (error) {
            return res.status(400).send({
                error
            })
        }
        await queryUpdate('UPDATE budget_types SET ? where id = ?', [type, type_id])
        res.send(type)
    } catch(e) {
        return res.status(500).send({error:e})
    }
});

router.delete('/types', async (req, res) => {
    // const type_id = req.params.id;
    const type_id = req.body.id
    const deleteSQL = await queryUpdate('DELETE FROM budget_types WHERE id = ?', type_id);
    if(deleteSQL.affectedRows === 1) {
        res.status(200).send({
            success: "Type has been deleted"
        })
    }
});

module.exports = router;