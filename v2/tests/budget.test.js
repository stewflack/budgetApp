const supertest = require('supertest')
const app = require('../src/app')
const Budget = require('../src/js/Budget')

const {setUpDatabase, closeConnection, clearDatabase} = require('./fixtures/test_database')
const {queryPromise, queryUpdate} = require('../../v2/src/db/databaseMethods')

const request = supertest(app)

beforeAll(async done => {
    await setUpDatabase()
    done()
})

afterAll(async () => {
    await clearDatabase()
    closeConnection()
})

