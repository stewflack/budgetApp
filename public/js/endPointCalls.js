const getBudgets = async () => {
    const myRequest = new Request('/budget', {
        method: 'GET'
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
        method: 'GET'
    });
    try {
        const resp = await fetch(myRequest)
        console.log('Getting totals')
        return resp.json()
    } catch (e) {
        console.log(e)
    }
}


async function postData(url = '',type, data) {
    try {
        const response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(data)
        });
        return response;
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
            }
        })
        return response.json()

    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    getBudgets,
    getBudgetSummary,
    postData,
    deleteData

}