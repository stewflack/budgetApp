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
        console.log('Getting totals')
        return resp.json()
    } catch (e) {
        console.log(e)
    }
}

// Example POST method implementation:
async function postData(url = '',type, data) {
    // console.log(data)
    // Default options are marked with *
    try {
        const response = await fetch(url, {
            method: type,
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

const deleteData = async (url, id) => {
    try {

        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        return response.json()

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
    postData,
    deleteData

}