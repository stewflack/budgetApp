const app = require('./app')
const chalk = require('chalk')
const port = process.env.PORT | 3000

app.listen(3000, ()=> {
    console.log(chalk.inverse.blueBright('Server is running' + port))
})