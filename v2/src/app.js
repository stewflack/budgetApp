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
app.post('/budget',  (req, res) => {
    // Budget Validation
    const data = new budgetValidation(req.body) // returns object

    if (!data.error || data.error.length === 0) {

        database.query('INSERT INTO budget SET ?', data, (error, results, fields) => {
            if (error) {
                return res.status(500)
            }
            console.log('Data Has been inputted')
            // Pass through the Budget Constuctor to get the unit percentage
            Budget.addSingleItem(res, results.insertId ) // Send back JSON with all parameters set

        })

    } else {
        res.status(400).send(data.error)
    }
})

/** Read All Budgets **/
app.get('/budget', (req, res) => {

    Budget.getAllBudgets(res)
})

app.get('/budget/totals', (req, res) => {
    // Return calculations of totals and prcentages
    Budget.getAllTotals()
    res.status(200).send({
        budgetTotal:Budget.budgetTotal,
        incomeTotal: Budget.incomeTotal,
        expenseTotal: Budget.expenseTotal,
        savingsTotal: Budget.savingsTotal,
        percentages: {
            sav: Budget.percentages.sav,
            exp: Budget.percentages.exp,
        }
    })
})
/** Read Single Budget **/
app.get('/budget/:id', (req, res) => {
    const id = req.params.id
    console.log(id)

    database.query('SELECT * FROM budget WHERE budget_id = ?',id ,(error, results, fields) => {

        console.log(error + 'error')
        console.log(results)
        if (error) {
            return res.status(500).send(error)
        }
        if (results.length === 0) {
            return res.status(400).send({
                error: 'ID not found in the Database'
            })
        }

        if (results.affectedRows === 0) {
            return res.status(400).send({
                error: 'ID not found'
            })
        }
        res.status(200).send(results)
    })

})

/** Update Budget **/
app.patch('/budget/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    console.log(body)
    const data = new budgetValidation(req.body) // returns object

    console.log(data)

    if (!data.error || data.error.length === 0) {
        database.query("UPDATE budget SET ? WHERE budget_id = ?", [data, id], (error, results) => {
            if (error) {
                return res.status(500).send(error)
            }

            if (results.affectedRows === 0) {
                return res.status(400).send({
                    error: 'ID not found'
                })
            }

            Budget.getAllBudgetsJSON(res, `Select * from budget where budget_id = ${id}`, (results) => {
                res.status(200).send(results)
            })


        })
    }
})

/** Delete Budget **/
app.delete('/budget/:id', (req, res) => {
    const id = req.params.id
    database.query("UPDATE budget SET deleted_at = NOW() WHERE budget_id = ?", id, (error, results, fields) => {
        if (error) {
            return res.status(500).send(error)
        }

        if (results.affectedRows === 0) {
            return res.status(400).send({
                error: 'ID not found'
            })
        }
        Budget.removeSingleItem(res, id)

        res.status(200).send({
            message: `${id} has been deleted`
        })
    })

})

app.listen(port, ()=> {
    console.log(chalk.inverse.blueBright('Server is running'))
})