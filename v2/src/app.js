const path = require('path')

const express = require('express')
var session = require('express-session');

const budgetRouter = require('./routers/budget')
const userRouter = require('./routers/user')
const hbs = require('hbs')

// INIT EXPRESS

const app = express()

// Define Paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
// Setup Handlebars engine and Views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(express.json())
app.use(express.static(publicDirPath))
app.use(budgetRouter)
app.use(userRouter)

app.get('/auth', (req, res) => {
    res.render('authentication')
})

module.exports = app

