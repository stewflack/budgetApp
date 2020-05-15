const bcrypt = require('bcryptjs')
const validator = require('validator')
// import validator from "validator/es";
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const ValidateUser = async (obj) => {
    const { name, email, password } = obj
    if (validator.isEmpty(name) || validator.isEmpty(password) || !validator.isEmail(email)) {
        // Validate user and hash password
        // throw new Error('Please fill in your name, email and password.')
        return ['Please fill in your name, email and password.', undefined]
    } else {
        if (!validator.isLength(password, {min:7, max: 20})) {
            return ['Password must be between 7 and 20 characters.', undefined]
        }
        return [undefined, await formatUser(name, email, password)]
    }

}

const formatUser = async (name, email, password) => {

    const nameCapitalized = capitalize(name)
    const hashedPassword = await bcrypt.hash(password, 8)
    return {
        user_name: nameCapitalized,
        user_email:email,
        user_password: hashedPassword
    }
}

const generateAuthToken = async (id) => {



}






module.exports = {
    ValidateUser
}