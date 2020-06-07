const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/js/Users')

const {setUpDatabase, closeConnection} = require('./fixtures/test_database')


const request = supertest(app)
/***
 * Can create user
 * Cannot create User
 * Empty Email/Password/Name
 * Invalid Email
 * Edit User
 * Invalid Edit
 * Delete User
 * Get User Profile
 */

/*
Before Test
 */
beforeAll(async done => {
    await setUpDatabase()
    done()
})

afterAll(() => {
    closeConnection()
})

test('Can create User', async done => {
    const response = await request.post('/users').send({
        name:"Stewart",
        email:"swflack11244321@gmail.com",
        password:"amber1995"
    }).expect(201)
    // check inserted into the database

    console.log(response.body)
    done()
})

test('Cannot create user with invalid email', async done => {
    await request.post('/users').send({
        name:"Stewart",
        email:"swflack124gmail.com",
        password:"amber1995"
    }).expect(400)
    // check inserted into the database
    done()
})

test('Cannot create account with password less than 7(i think)', () => {
    request.post('/users').send({

    }).expect(400)
})

test('Cannot create user with empty name, email or password', () => {
    request.post('/users').send({

    }).expect(400)
})

test('Can edit user email & password', () => {
    request.put('/users').send({

    }).expect(200)
})

test('Can delete user account', () => {
    request.delete('/users').send({

    }).expect(200)
})

test('Can get user profile', () => {
    request.get('/users').send({

    }).expect(200)
})

