const validator = require('validator')
const chalk = require('chalk')
const database = require('../db/database')

module.exports = class Budget {
    constructor() {
        this.incomeTotal = this.getIncomeTotal();
        this.savingsTotal = this.getSavingsTotal();
        this.expenseTotal = this.getExpenseTotal()
    }

    getAllBudgetsJSON(response, query, callback) {
        database.query(query, (error, results, fields) => {
            if (error) {
                return response.status(500).send(error)
            }
            callback(results)
        })
    }

    getAllBudgets(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE deleted_at is null', (results) => {
            response.status(200).send(results)
        })
    }

    // Calculate Total Budget
    // getBudgetTotal(response) {
    //     this.getAllBudgetsJSON(response,'SELECT * FROM budget', (results) => {
    //         let arr = results.map(el => {
    //             return el.budget_value
    //         })
    //         this.budgetTotal = arr.reduce((a, b) => a + b, 0)
    //     })
    // }
    // Calculate Total Income
    getIncomeTotal(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE budget_type = "inc"', (results) => {
            // this.incomeTotal = this.calculateTotals(results)
            let arr = results.map(el => {
                return el.budget_value
            })
            this.incomeTotal = arr.reduce((a, b) => a + b, 0)
        })
    }
    // Calculate Total Savings
    getSavingsTotal(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE budget_type = "sav"', (results) => {
            // this.incomeTotal = this.calculateTotals(results)
            let arr = results.map(el => {
                return el.budget_value
            })
            this.savingsTotal = arr.reduce((a, b) => a + b, 0)
        })
    }
    // Calculate Total Expense
    getExpenseTotal(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE budget_type = "exp"', (results) => {
            // this.incomeTotal = this.calculateTotals(results)
            let arr = results.map(el => {
                return el.budget_value
            })
            this.expenseTotal = arr.reduce((a, b) => a + b, 0)
        })
    }
    // Calculate Percentage - later on

    getAllTotals(response) {
        // this.getBudgetTotal(response)
        this.getIncomeTotal(response)
        this.getSavingsTotal(response)
        this.getExpenseTotal(response)

        this.budgetTotal = this.incomeTotal - this.expenseTotal - this.savingsTotal

        response.status(200).send({
            budgetTotal : this.budgetTotal, // minus the other 2 not income
            incomeTotal: this.incomeTotal,
            expenseTotal: this.expenseTotal,
            savingsTotal: this.savingsTotal
        })
    }


}