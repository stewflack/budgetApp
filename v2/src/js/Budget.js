const validator = require('validator')
const chalk = require('chalk')
const database = require('../db/database')

module.exports = class Budget {
    constructor() {
        this.incomeTotal = this.getIncomeTotal();
        this.savingsTotal = this.getSavingsTotal();
        this.expenseTotal = this.getExpenseTotal();
        this.percentages = {
            exp: -1,
            sav: -1
        }
    }
    // Calculate Percentage
    calcPercentage(amount, total) {
        return Math.round((amount/total) *100)
    }

    getAllBudgetsJSON(response, query, callback) {
        database.query(query, (error, results, fields) => {
            if (error) {
                return response.status(500).send(error)
            }
            callback(results)
        })
    }

    addSingleItem(response, id) {
        this.getAllBudgetsJSON(response, `Select * From budget where budget_id = ${id}`, (results) => {
            results.forEach(el => {
                switch (el.budget_type) {
                    case 'inc':
                        this.incomeTotal += el.budget_value
                        break
                    case 'exp':
                        this.expenseTotal += el.budget_value
                        break
                    case 'sav':
                        this.savingsTotal += el.budget_value
                        break
                }
                if (el.budget_type !== 'inc') {
                    el.percent = this.calcPercentage(el.budget_value, this.incomeTotal)
                    response.send(el)
                } else {
                    response.send(el)
                }
            })
        })
    }

    removeSingleItem(response, id) {
        this.getAllBudgetsJSON(response, `Select * From budget where budget_id = ${id}`, (results) => {
            results.forEach(el => {
                switch (el.budget_type) {
                    case 'inc':
                        this.incomeTotal -= el.budget_value
                        // console.log(this.incomeTotal)
                        break
                    case 'exp':
                        this.expenseTotal -= el.budget_value
                        // console.log(this.expenseTotal)
                        break
                    case 'sav':
                        this.savingsTotal -= el.budget_value
                        // console.log(this.savingsTotal)
                        break
                }
            })
        })
    }

    getAllBudgets(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE deleted_at is null', (results) => {
            results.forEach(el => {
                el.percent = this.calcPercentage(el.budget_value, this.incomeTotal)
            })
            response.status(200).send(results)
        })
    }

    // Calculate Total Income
    getIncomeTotal(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE budget_type = "inc" && deleted_at is null', (results) => {
            // this.incomeTotal = this.calculateTotals(results)
            let arr = results.map(el => {
                return el.budget_value
            })
            this.incomeTotal = arr.reduce((a, b) => a + b, 0)
        })
    }
    // Calculate Total Savings
    getSavingsTotal(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE budget_type = "sav" && deleted_at is null', (results) => {
            // this.incomeTotal = this.calculateTotals(results)
            let arr = results.map(el => {
                return el.budget_value
            })
            const sum = arr.reduce((a, b) => a + b, 0)
            this.savingsTotal = sum
            this.percentages.sav = this.calcPercentage(sum,this.incomeTotal)
        })
    }
    // Calculate Total Expense
    getExpenseTotal(response) {
        this.getAllBudgetsJSON(response, 'SELECT * FROM budget WHERE budget_type = "exp" && deleted_at is null', (results) => {
            // this.incomeTotal = this.calculateTotals(results)
            let arr = results.map(el => {
                return el.budget_value
            })
            const sum = arr.reduce((a, b) => a + b, 0)
            this.expenseTotal = sum
            this.percentages.exp = this.calcPercentage(sum, this.incomeTotal)
        })
    }


    getAllTotals(response) {
        // this.getBudgetTotal(response)
        this.budgetTotal = this.incomeTotal - (this.expenseTotal + this.savingsTotal)
    }


}