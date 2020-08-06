const jwt = require('jsonwebtoken')
const {queryUpdate, queryPromise} = require('../db/databaseMethods')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'ChangeToEnv')
        // TODO expired token
        /// `exp` = 1589552840
        const result = await queryUpdate(`Select * from tokens where token = ?`, token)
        console.log(result)
        if (result.length === 0) {
            return res.status(400).send({
                error: 'Unable to sign in please try again.'
            })
        }

        req.token = token
        req.user = result[0].user_id
        } catch (e) {
            res.status(400).send({
                error: 'Unable to sign in please try again.',
                message: e
            })

        }

        next()

}
module.exports = auth