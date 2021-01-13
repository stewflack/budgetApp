const validator = require('validator');
const {queryUpdate, queryPromise} = require('../db/databaseMethods');
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const validateBudgetType = async (object) => {
    const { type_name, colour, user_id } = object;
    if(validator.isEmpty(type_name) || validator.isEmpty(colour)) {
        return ['Please ensure you have a budget type name and colour specified', undefined];
    }
    // type name no longer than 15 characters 
    if (!validator.isLength(type_name, {min:3, max: 15})) {
        return ['Budget Type must be between 3 and 15 characters.', undefined]
    }
    // create 3 letter shorthand 
    const type_shorthand = getShorthand(type_name);
    // capitalise first letter 
    const nameCapitalized = capitalize(type_name);
    // insert into the db w/ user
    const databaseObj = {
        user_id,
        type_name: nameCapitalized,
        short_hand: type_shorthand,
        colour
    }

    return [undefined, databaseObj];

}

const getShorthand = (budgetType) => {
    // first 3 letters + all to lowercase
    const three = budgetType.substring(0, 3);
    return three.toLowerCase();
}

module.exports = {
    validateBudgetType
}