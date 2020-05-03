const validator = require('validator')
const chalk = require('chalk')
const database = require('../db/database')

module.exports = class Budget {
    constructor() {
        this.budgetTotal = 0;
        this.incomeTotal = 0;
        this.savingsTotal = 0;
        this.expenseTotal = 0;
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
            results.forEach(el => {// Removed the switch bit from here. not sure what is happening now with the budget
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
    // Create function which can be reused to query the db. then return a promise straight away

    testCalcSummary(query) {
        return new Promise((resolve, reject) => {
            database.query(query, (error, result, fields) => {
                if (error) {
                    reject(error)
                }

                // console.log(result[0])
                resolve(result[0])

            })
        })
    }

    calculateBudgetSummary() {
        const Sql = `SELECT SUM(budget_value) as total from budget where budget_type = 'inc' and deleted_at is null
                        UNION
                        SELECT SUM(budget_value) as total from budget where budget_type = 'exp' and deleted_at is null
                        UNION
                        SELECT SUM(budget_value) as total from budget where budget_type = 'sav' and deleted_at is null`;
        return new Promise((resolve, reject) => {
                database.query(Sql, (error, result, fields) => {
                    if (error) {
                        reject(error)
                    }
                    if (result.length !== 1) {
                        console.log(result)
                        if (result[0]) {
                            if (result[0].total === null) {
                                this.incomeTotal = 0
                            } else {
                                this.incomeTotal = result[0].total
                            }
                        } else {
                            this.incomeTotal = 0
                        }

                        if (result[1]) {
                            if (result[1].total === null) {
                                this.expenseTotal = 0
                            } else {
                                this.expenseTotal = result[1].total
                            }
                        } else {
                            this.expenseTotal = 0
                        }

                        if (result[2]) {
                            if (result[2].total === null) {
                                this.savingsTotal = 0
                            } else {
                                this.savingsTotal = result[2].total
                            }
                        } else {
                            this.savingsTotal = 0
                        }

                        console.log(
                            // `Budget Total: ${this.budgetTotal}
                        `Income Total: ${this.incomeTotal}
                        Expense Total: ${this.expenseTotal}
                        Savings Total: ${this.savingsTotal}`
                        )
                        this.percentages.sav = this.savingsTotal !== 0 ? this.calcPercentage(this.savingsTotal,this.incomeTotal) : -1
                        this.percentages.exp = this.expenseTotal !== 0 ? this.calcPercentage(this.expenseTotal ,this.incomeTotal) : -1
                    }


                    this.budgetTotal = this.incomeTotal - (this.expenseTotal + this.savingsTotal)
                    console.log(
                        `Budget Total: ${this.budgetTotal}
                        Income Total: ${this.incomeTotal}
                        Expense Total: ${this.expenseTotal}
                        Savings Total: ${this.savingsTotal}`
                    )

                    resolve({
                        budgetTotal: this.budgetTotal,
                        incomeTotal: this.incomeTotal,
                        expenseTotal: this.expenseTotal,
                        savingsTotal: this.savingsTotal,
                        percentages: {
                            exp: this.percentages.exp,
                            sav: this.percentages.sav
                        }
                    })
                })
            })
    }

    getIncTotal() {
        this.testCalcSummary('SELECT SUM(budget_value) as total from budget where budget_type = "inc" and deleted_at is null').then(res => {
            if (res.total === null) {
                this.incomeTotal = 0
                // console.log(
                //     `Budget Total: ${this.budgetTotal}
                //         Income Total: ${this.incomeTotal}
                //         Expense Total: ${this.expenseTotal}
                //         Savings Total: ${this.savingsTotal}`
                // )
            } else {
                this.incomeTotal = res.total

            }
        }).catch(e => {
            console.log(e)
        })
    }

    getExpTotal() {
        this.testCalcSummary(`SELECT SUM(budget_value) as total from budget where budget_type = 'exp' and deleted_at is null`).then(res => {
            if (res.total === null) {
                this.expenseTotal = 0

            } else {
                this.expenseTotal = res.total

            }
        }).catch(e => console.log(e))
    }

    getSavTotal() {
        this.testCalcSummary(`SELECT SUM(budget_value) as total from budget where budget_type = 'sav' and deleted_at is null`).then(res => {

                if (res.total === null) {
                    this.savingsTotal = 0
                } else {
                    this.savingsTotal = res.total;
                }
        }).catch(e => console.log(e))
    }

    getTotals() {
        return new Promise((resolve, reject) => {
            this.getIncTotal()
            this.getExpTotal()
            this.getSavTotal()

            const budgetTotal = this.incomeTotal - (this.expenseTotal = this.savingsTotal)
            this.percentages.sav = this.savingsTotal !== 0 ? this.calcPercentage( this.savingsTotal,this.incomeTotal) : -1
            this.percentages.exp = this.expenseTotal !== 0 ? this.calcPercentage( this.expenseTotal,this.incomeTotal) : -1

            resolve ({
                budgetTotal,
                incomeTotal: this.incomeTotal,
                expenseTotal: this.expenseTotal,
                savingsTotal: this.savingsTotal,
                percentages: {
                    exp: this.percentages.exp,
                    sav: this.percentages.sav
                }
            })
        })


    }



}