const jwt = require('jsonwebtoken')

const token = jwt.sign(1, 'ChangeToEnv')
console.log(token)