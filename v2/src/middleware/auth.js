const jwt = require('jsonwebtoken')
const session = require('express-session');
const {queryUpdate, queryPromise} = require('../db/databaseMethods')
const auth = async (req, res, next) => {
    if(req.session.loggedIn) {
        try {
            const token = req.session.token;
            const decode = jwt.verify(token, 'ChangeToEnv');
            // TODO expired token
            /// `exp` = 1589552840
            const result = await queryUpdate(`Select * from tokens where token = ?`, token)
            console.log(result)
            if (result.length === 0) {
                return res.status(400).send({
                    error: 'Unable to sign in please try again.'
                })
            }
    
            req.session.userID = result[0].user_id;
            } catch (e) {
                res.status(400).send({
                    error: 'Unable to sign in please try again.',
                    message: e
                })
                res.end();
            }
    
        next();
    }
}
module.exports = auth