const path = require('path')

const express = require('express')
const hbs = require('hbs')
const validator = require('validator')
const chalk = require('chalk')
const database = require('./db/database')
const budget = require('./js/Budget')
const budgetValidation = require('./js/BudgetValidation')

const port = process.env.PORT || 3000

// INIT EXPRESS

const app = express()
const Budget = new budget();


// Define Paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
// Setup Handlebars engine and Views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.json())
app.use(express.static(publicDirPath))


const bodyVariableCheck = (body) => {
    // HERE TO CHECK IF type, description and value is present
}
app.get('', (req, res) => {
    res.render('index', {
        title: 'Budget App',
        name: 'Stewart Flack'
    })
})
/** Create Budget **/
app.post('/budget',  async (req, res) => {
    // Budget Validation
    const data = new budgetValidation(req.body) // returns object

    if (!data.error || data.error.length === 0) {
        try {
            const newBudget = await Budget.queryUpdate('INSERT INTO budget SET ?', data)
            await Budget.addSingleItemToBudget(res, newBudget.insertId)
            res.status(201).send()
        } catch (e) {
            res.status(500).send()
        }
    } else {
        res.status(400).send(data.error)
    }
})
app.get('/test', async (req, res) => {
    Budget.calculateBudgetSummary().then(res => {
        console.log(res)
    }).catch(e=> console.log(e))

})
/** Read All Budgets **/
app.get('/budget', async (req, res) => {
    await Budget.getAllBudgets(res)
})

app.get('/budget/totals', async (req, res) => {
    // Return calculations of totals and prcentages

    try {
        const budgetTotals = await Budget.calculateBudgetSummary()
        res.send(budgetTotals)
    } catch (e) {
        throw new Error(e)
    }

})
/** Read Single Budget **/
app.get('/budget/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const budgetItem = await Budget.queryPromise(`SELECT * FROM budget WHERE budget_id = ${id}`)
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
app.patch('/budget/:id', async (req, res) => {
    const id = req.params.id
    const data = new budgetValidation(req.body) // returns object
    
    if (!data.error || data.error.length === 0) {
        try {
            const update = await Budget.queryUpdate(`UPDATE budget SET ? WHERE budget_id = ?`, [data, id])
            if (update.affectedRows === 0) {
                return res.status(500).send({
                    error: 'ID not found'
                })
            }

            res.status(200).send(await Budget.queryPromise(`Select * from budget where budget_id = ${id}`))
        } catch (e) {
            res.status(500).send(e)
        }
    }
})

/** Delete Budget **/
app.delete('/budget/:id', async (req, res) => {
    const id = req.params.id
    try {
        const budget = await Budget.queryUpdate('UPDATE budget SET deleted_at = NOW() WHERE budget_id = ?', id)
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

app.listen(port, ()=> {
    console.log(chalk.inverse.blueBright('Server is running'))
})