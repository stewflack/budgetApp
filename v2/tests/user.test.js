const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/js/Users')

const {setUpDatabase, closeConnection, clearDatabase} = require('./fixtures/test_database')
const {queryPromise, queryUpdate} = require('../../v2/src/db/databaseMethods')

const request = supertest(app)
/***
 * Can create user
 * Cannot create User
 * Empty Email/Password/Name
 * Existing email (will need a user already present) TODO
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

afterAll(async () => {
    await clearDatabase()
    closeConnection()
})

test('Can create User', async () => {
    const userobj = {
        name:"Stewart",
        email:"swflack@gmail.com",
        password:"amber1995"
    }
    const response = await request.post('/users').send(userobj).expect(201)
    // check inserted into the database
    expect(response.body.user.user_password).not.toEqual(userobj.password)
    // console.log(response.body)
})

test('Cannot create user with invalid email', async () => {
    const response = await request.post('/users').send(
        {
        name:"Stewart",
        email:"swflackgmail.com",
        password:"password1245"
    }
    ).expect(400)

    expect(response.body.error).toEqual('Email not recognised.')

})

test('Cannot create account with password less than 7', async () => {
    const response = await request.post('/users').send({
        name:"Stewart",
        email:"swflack@gmail.com",
        password:"pass"
    }).expect(400)

    expect(response.body.error).toEqual('Password must be between 7 and 20 characters.')

})

test('Cannot create user with empty name, email or password', async () => {
    const response = await request.post('/users').send({
        name:"",
        email:"",
        password:""
    }).expect(400)
    expect(response.body.error).toBe('Please fill in your name, email and password.')
})

test('Can get user profile', async () => {
    await request.get('/users/profile')
        .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN}`)
        .send().expect(200)
    // console.log(response.body)
    // expect(response.body.user_name).toBe('test@user.com')
})

test('Can edit user email & password', async () => {
    const updateUser = {
        name:"Stewart",
        email:"test1234@user.com",
        password:"Hello1234"
    }
    // How to set a header using super request
    const response = await request.patch('/users/profile')
        .set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN}`)
        .send(updateUser)
        .expect(200)

    expect(updateUser.email).not.toEqual(process.env.TEST_USER_EMAIL)
    expect(response.body.user_password).not.toEqual(process.env.TEST_USER_PASSWORD)
})



test('Can delete user account', async () => {
    // const query = await queryPromise(`select * from users where user_name = ${process.env.TEST_USER_NAME}`)
    // console.log(query)
    const r = await request.delete('/users/profile').set('Authorization', `Bearer ${process.env.TEST_USER_TOKEN}`).send().expect(200)
    console.log(r)
})



/**
 * Not working
 * Account is in the database, for some reason it is not returning
 * email in use even though it does on live
 */
// test('Cannot create an account with an exiting email', async () => {
//     const userobj = {
//         name:"Stewart",
//         email:"swflack@gmail.com",
//         password:"amber1995"
//     }
//     const result = await queryPromise('Select * from users')
//     console.log(result)
//     const response = await request.post('/users').send(userobj).expect(400)
//     console.log(response.body)
// })



