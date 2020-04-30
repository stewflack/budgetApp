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


module.exports = {
    getBudgets,
    getBudgetSummary
}