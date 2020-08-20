const express = require('express')
const auth = require('../middleware/auth')
const budget = require('../js/Budget')
const budgetValidation = require('../js/BudgetValidation')
const { queryPromise, queryUpdate } = require('../db/databaseMethods')
const router = new express.Router()

const Budget = new budget();

router.get('/my-budget', auth, (req, res) => {
    res.render('index', {
        title: 'Budget App',
        name: 'Stewart Flack'
    })
})
/** Create Budget **/
router.post('/budget', auth ,async (req, res) => {
    // Budget Validation
    const data = new budgetValidation(req.body) // returns object
    data.user_id = req.user

    if (!data.error || data.error.length === 0) {
        try {
            const newBudget = await queryUpdate('INSERT INTO budget SET ?', data)
            await Budget.addSingleItemToBudget(res, newBudget.insertId)
            res.status(201).send()
            res.end();
        } catch (e) {
            res.status(500).send()
            res.end();
        }
    } else {
        res.status(400).send(data.error)
        res.end();
    }
})

router.get('/budget/test', auth,async (req, res) => {
    Budget.calculateBudgetSummary(req.user).then(res => {
        console.log(res)
    }).catch(e=> console.log(e))

})
/** Read All Budgets **/
router.get('/budget', auth,async (req, res) => {
    await Budget.getAllBudgets(res, req.user)
    res.end();
})

router.get('/budget/totals', auth ,async (req, res) => {
    // Return calculations of totals and prcentages

    try {
        const budgetTotals = await Budget.calculateBudgetSummary(req.user)
        res.send(budgetTotals)
        res.end();
    } catch (e) {
        throw new Error(e)
        res.end();
    }

})
/** Read Single Budget **/
router.get('/budget/:id', auth,async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const budgetItem = await queryPromise(`SELECT * FROM budget WHERE budget_id = ${id} and user_id = ${req.user}`)
        if (budgetItem.length === 0) {
            return res.status(400).send({
                error: 'Not found in the Database'
            })
        }
        if (budgetItem.affectedRows === 0) {
            return res.status(400).send({
                error: 'Not found'
            })
        }
        res.status(200).send(budgetItem)
        res.end();
    } catch (e) {
        return res.status(500).send(e)
    }

})

/** Update Budget **/
router.patch('/budget/:id', auth ,async (req, res) => {
    const id = req.params.id
    const data = new budgetValidation(req.body) // returns object

    if (!data.error || data.error.length === 0) {
        try {
            const update = await queryUpdate(`UPDATE budget SET ? WHERE budget_id = ? and user_id = ?`, [data, id, req.user])
            if (update.affectedRows === 0) {
                return res.status(500).send({
                    error: 'Not found'
                })
            }
            const updatedBudget = await Budget.getUpdatedBudgetObject(`Select * from budget where budget_id = ${id} and user_id = ${req.user}`, req.user)

            res.status(200).send(updatedBudget)
            res.end();
        } catch (e) {
            return res.status(500).send(e)
        }
    }
})

/** Delete Budget **/
router.delete('/budget/:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        const budget = await queryUpdate('UPDATE budget SET deleted_at = NOW() WHERE budget_id = ? and user_id = ?', [id, req.user])
        if (budget.affectedRows === 0) {
            return res.status(500).send({
                error: 'ID not found'
            })
        }
        await Budget.removeSingleItemFromBudget(res, id)
        res.status(200).send({
            message: `${id} has been deleted`
        })
        res.end();
    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router