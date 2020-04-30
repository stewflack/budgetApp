const base = require('./base')
const endpoint = require('./endPointCalls')
const budgetView = require('./views/budgetView')

/**** BUDGET CONTROLLER *****/
const budgetController = () => {

    const updateBudgetItems = () => {
        endpoint.getBudgets().then(res => {
            res.forEach((el) => {
                budgetView.addListItem(el, el.budget_type)
            })
        })
    }

    const updateBudgetSummary = () => {
        endpoint.getBudgetSummary().then(res => {
            budgetView.displayBudget(res)
            console.log(res)
        })
    }



    return {
        init: () =>{
            console.log('Application has started on the client')

            // Display Months
            budgetView.displayMonth()

            // Update Budget Items
            updateBudgetItems()

            // Update Overalls
            updateBudgetSummary()
        }
    }
}

budgetController().init()
