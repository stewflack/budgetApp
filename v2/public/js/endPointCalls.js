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

// Example POST method implementation:
async function postData(url = '', data) {
    // console.log(data)
    // Default options are marked with *
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(data)
        });
        return response.json(); // parses JSON response into native JavaScript objects
    } catch (e) {
        console.error(e)
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
    getBudgetSummary,
    postData
}