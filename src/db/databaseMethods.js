const database = require('./connection')
const queryPromise = (query) => {
    return new Promise((resolve, reject) => {
        database.query(query, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

const queryUpdate = (query, updates) => {
    return new Promise((resolve, reject) => {
        database.query(query, updates,(error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

module.exports = {
    queryPromise,
    queryUpdate
}