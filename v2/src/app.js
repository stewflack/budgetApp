const express = require('express')
const validator = require('validator')
const chalk = require('chalk')
const database = require('./db/database')

const Budget = require('./db/BudgetValidation')

const port = process.env.PORT || 3000

// INIT EXPRESS
const app = express()
app.use(express.json())


const bodyVariableCheck = (body) => {
    // HERE TO CHECK IF type, description and value is present
}
/** Create Budget **/
app.post('/budget',  (req, res) => {
    const body = req.body

    // Budget Validation
    const budget = new Budget(body);
    const data = budget.returnInput()

    if (!data.error || data.error.length === 0) {

        database.query('INSERT INTO budget SET ?', data, (error, results, fields) => {
            if (error) {
                return res.status(500)
            }
            res.status(201).send({insertedID: results.insertId}) // Return inserted ID to then be used client side if needed
        })

    } else {
        res.status(400).send(data.error)
    }
})

/** Read All Budgets **/
app.get('/budget', (req, res) => {
    database.query('SELECT * FROM budget', (error, results, fields) => {
        if (error) {
            return res.status(500)
        }

        res.status(200).send(results)
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

    const budget = new Budget(body);
    const data = budget.returnInput()

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

            res.status(200).send({
                message: results.rowsAffected
            })
        })
    }
})

/** Delete Budget **/
app.delete('/budget/:id', (req, res) => {
    const id = req.params.id
    database.query("UPDATE budget SET deleted_at = NOW() WHERE budget_id = ?", id, (error, results) => {
        if (error) {
            return res.status(500).send(error)
        }

        if (results.affectedRows === 0) {
            return res.status(400).send({
                error: 'ID not found'
            })
        }

        res.status(200).send({
            message: `${id} has been deleted`
        })
    })

})

app.listen(port, ()=> {
    console.log(chalk.inverse.blueBright('Server is running'))
})