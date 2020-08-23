const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTY3NDA2OTksImlkIjozLCJpYXQiOjE1OTY3MzcwOTl9.jOxQI2_TYQrXImFriwSRZw0vUwdBcydbaTDpUlqkpCc';
const myHeaders = new Headers();
// Here is where it needs to be set
myHeaders.append('Authorization', token);


const getBudgets = async () => {
    const myRequest = new Request('/budget', {
        method: 'GET',
        headers: myHeaders
    });

    try {
        const resp = await fetch(myRequest)

        let data = resp.json()
        console.log(data)
        return data
    } catch (err) {
        console.log(err)
    }
}

const getBudgetSummary = async () => {
    const myRequest = new Request('/budget/totals', {
        method: 'GET',
        headers: myHeaders
    });
    try {
        const resp = await fetch(myRequest)
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
                'Content-Type': 'application/json',
                'Authorization': token
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
                'Content-Type': 'application/json',
                'Authorization': token
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