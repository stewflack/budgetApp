const getBudgets = async () => {
    try {
        const resp = await fetch('/budget')
        return resp.json()
    } catch (err) {
        console.log(err)
    }
}

const getBudgetSummary = async () => {
    try {
        const resp = await fetch('/budget/totals')
        return resp.json()
    } catch (e) {
        console.log(e)
    }
}

/***
 * Calculate the Percentages
 * Implement the EventListeners for editing, adding, deleting and reading data
 * Small UI changes including
 *          : Focus Fields
 *          : Colour CHanges
 *          ECT
 *
 * After this It SHOULD be at the same stage as before, next to implement user Authentication
 */


module.exports = {
    getBudgets,
    getBudgetSummary
}