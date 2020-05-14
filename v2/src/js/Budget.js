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
    queryPromise(query) {
        return new Promise((resolve, reject) => {
            database.query(query, (error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result)
            })
        })
    }

    queryUpdate(query, updates) {
        return new Promise((resolve, reject) => {
            database.query(query, updates,(error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result)
            })
        })
    }

    async addSingleItemToBudget(response, id) {
        try {
            const add = await this.queryPromise(`Select * From budget where budget_id = ${id}`)
            add.forEach(el => {// Removed the switch bit from here. not sure what is happening now with the budget
                if (el.budget_type !== 'inc') {
                    if( this.incomeTotal > 0) {
                        // total % of income spent
                        el.percent = this.calcPercentage(el.budget_value, this.incomeTotal)
                    } else {
                        el.percent = -1
                    }
                    response.send(el)
                } else {
                    response.send(el)
                }
            })
        } catch (e) {
            response.status(500).send(e)
        }

    }

    async removeSingleItemFromBudget(response, id) {
        try {
            const remove = await this.queryPromise(`Select * From budget where budget_id = ${id}`)
            remove.forEach(el => {
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
        } catch (e) {
            response.status(500).send(e)
        }

    }
    // On startup this is called
    async getAllBudgets(response) {
        try {
            const budgets = await this.queryPromise('SELECT * FROM budget WHERE deleted_at is null')
            for (const budget of budgets) {
                budget.percent = await this.calcPercentage(budget.budget_value, this.incomeTotal)
            }
            response.send(budgets)
        } catch (e) {
            response.status(500).send(e)
        }
    }
    // Create function which can be reused to query the db. then return a promise straight away

    async calculateBudgetSummary() {
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
                        // console.log(result)
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

                        if( this.incomeTotal > 0) {
                            // total % of income spent
                            this.percentages.sav = this.calcPercentage(this.savingsTotal, this.incomeTotal)
                            this.percentages.exp = this.calcPercentage(this.expenseTotal ,this.incomeTotal)
                        } else {
                            this.percentages.exp = -1;
                            this.percentages.sav = -1;
                        }
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
    async getUpdatedBudgetObject(query) {
        try {
            const budgets = await this.queryPromise(query)
            const totals = await this.calculateBudgetSummary()
            for (const budget of budgets) {
                console.log(`Budget Value ${budget.budget_value} and income total: ${totals.incomeTotal}`)

                budget.percent = await this.calcPercentage(budget.budget_value, this.incomeTotal)
            }
            return budgets
        } catch (e) {
            throw new Error(e)
        }


    }



}