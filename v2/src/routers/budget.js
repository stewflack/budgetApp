const express = require('express')

const budget = require('../js/Budget')
const budgetValidation = require('../js/BudgetValidation')
const {queryPromise, queryUpdate} = require('../db/databaseMethods')
const router = new express.Router()

const Budget = new budget();


/** Create Budget **/
router.post('/budget',  async (req, res) => {
    // Budget Validation
    const data = new budgetValidation(req.body) // returns object

    if (!data.error || data.error.length === 0) {
        try {
            const newBudget = await queryUpdate('INSERT INTO budget SET ?', data)
            await Budget.addSingleItemToBudget(res, newBudget.insertId)
            res.status(201).send()
        } catch (e) {
            res.status(500).send()
        }
    } else {
        res.status(400).send(data.error)
    }
})

router.get('/budget/test', async (req, res) => {
    Budget.calculateBudgetSummary().then(res => {
        console.log(res)
    }).catch(e=> console.log(e))

})
/** Read All Budgets **/
router.get('/budget', async (req, res) => {
    await Budget.getAllBudgets(res)
})

router.get('/budget/totals', async (req, res) => {
    // Return calculations of totals and prcentages

    try {
        const budgetTotals = await Budget.calculateBudgetSummary()
        res.send(budgetTotals)
    } catch (e) {
        throw new Error(e)
    }

})
/** Read Single Budget **/
router.get('/budget/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const budgetItem = await queryPromise(`SELECT * FROM budget WHERE budget_id = ${id}`)
        if (budgetItem.length === 0) {
            return res.status(400).send({
                error: 'ID not found in the Database'
            })
        }
        if (budgetItem.affectedRows === 0) {
            return res.status(400).send({
                error: 'ID not found'
            })
        }
        res.status(200).send(budgetItem)
    } catch (e) {
        return res.status(500).send(e)
    }

})

/** Update Budget **/
router.patch('/budget/:id', async (req, res) => {
    const id = req.params.id
    const data = new budgetValidation(req.body) // returns object

    if (!data.error || data.error.length === 0) {
        try {
            const update = await queryUpdate(`UPDATE budget SET ? WHERE budget_id = ?`, [data, id])
            if (update.affectedRows === 0) {
                return res.status(500).send({
                    error: 'ID not found'
                })
            }
            const updatedBudget = await Budget.getUpdatedBudgetObject(`Select * from budget where budget_id = ${id}`)

            res.status(200).send(updatedBudget)
        } catch (e) {
            res.status(500).send(e)
        }
    }
})

/** Delete Budget **/
router.delete('/budget/:id', async (req, res) => {
    const id = req.params.id
    try {
        const budget = await queryUpdate('UPDATE budget SET deleted_at = NOW() WHERE budget_id = ?', id)
        if (budget.affectedRows === 0) {
            return res.status(500).send({
                error: 'ID not found'
            })
        }
        await Budget.removeSingleItemFromBudget(res, id)
        res.status(200).send({
            message: `${id} has been deleted`
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router