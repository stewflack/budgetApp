const express = require('express')
const validator = require('validator')
const chalk = require('chalk')
const database = require('./db/database')

const port = process.env.PORT || 3000

// INIT EXPRESS
const app = express()
app.use(express.json())

/** Create Budget **/
app.post('/budget',  (req, res) => {
    // This will need validation at somepoint, create node object and validate that way
    const body = req.body
    database.query('INSERT INTO budget SET ?', body, (error, results, fields) => {
        if (error) {
            return res.status(500)
        }
        res.status(201).send({insertedID: results.insertId}) // Return inserted ID to then be used client side if needed
    })
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
    if (!id) {
        return res.status(400).send()
    }

    database.query('SELECT * FROM budget WHERE budget_id = ?',id ,(error, results, fields) => {
        if (error) {
            return res.status(500).send(error)
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

    database.query("UPDATE budget SET ? WHERE budget_id = ?", [body, id], (error, results) => {
        if (error) {
            return res.status(500).send(error)
        }

        if (results.affectedRows === 0) {
            return res.status(400).send({
                error: 'ID not found'
            })
        }

        res.status(200).send()
    })
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