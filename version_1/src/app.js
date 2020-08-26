const path = require('path')

const express = require('express')
const hbs = require('hbs')


/**
 * Express Set Up
 * Ports
 */
const app = express()
const port = process.env.PORT || 3000

// Paths for express config
const publicDirPath = path.join(__dirname, '../dist')
const viewsPath = path.join(__dirname, '../templates')
const partialsPath = path.join(__dirname, '../templates/partials')
// Setup Handlebars engine and Views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// hbs.registerPartials(partialsPath)

app.use(express.static(publicDirPath))

// app.get('', (req, res) => {
//     res.sendFile('../dist/index.html')
// })



app.listen(port,() => {
    console.log(`Server has started... port: ${port}`)
})