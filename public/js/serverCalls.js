const request = async (url, method, headers = null, body = null) => {
    return await fetch(url, {
        method,
        headers,
        body
    })
}

const postData = async (url = '',type, data) => {
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