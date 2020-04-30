const validator = require('validator')
const chalk = require('chalk')
const database = require('../db/database')

module.exports = class Budget {
    constructor() {
        this.budgetTotal = 0
    }

    getAllBudgetsJSON(query, callback) {
        database.query(query, (error, results, fields) => {
            if (error) {
                return console.log(error)
            }
            callback(error, results)
        })
    }

    getAllBudgets(response) {
        this.getAllBudgetsJSON('SELECT * FROM budget WHERE budget_type is not null', (error, results) => {
            if (error) {
                return response.status(500)
            }
            response.status(200).send(results)
        })
    }



    // Calculate Total Budget
    getBudgetCalculations(response) {

        this.getAllBudgetsJSON('SELECT * FROM budget', (error, results) => {
            if (error) {
                return console.log(error)
            }
            let total = 0
             results.forEach(el => {
                total += el.budget_value
            })
            // console.log(chalk.inverse.green(total))

            this.budgetTotal = total

            response.status(200).send({
                budgetTotal : this.budgetTotal
            })
        })
    }

    // Calculate Total Income
    // Calculate Total Savings
    // Calculate Total Expense
    // Calculate Percentage - later on



}