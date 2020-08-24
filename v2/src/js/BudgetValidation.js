const validator = require('validator')
module.exports = class BudgetValidation {
    constructor(bodyArray) {
        this.budget_type = bodyArray.budget_type ? bodyArray.budget_type : '';
        this.budget_description = bodyArray.budget_description ? bodyArray.budget_description : '';
        this.budget_value = bodyArray.budget_value ? bodyArray.budget_value : '';
    }

    checkEmpty(p) {
        console.log(p)
        console.log(!validator.isEmpty(p))
        if (validator.isEmpty(p)) {
            return this.error({
                error: 'A parameter should not be empty'
            })
        }
    }

    checkIfStringContainsNumbers() {
        if (validator.isHexadecimal(this.type)) {
            return this.error({
                error:'Type should not contain a number'
            })
        }
    }

    checkString() {
        if (typeof this.value === 'string') {
            this.value = parseInt(this.value)
        }
    }

    returnInput() {
        this.checkEmpty(this.type)
        this.checkEmpty(this.description)
        this.checkEmpty(this.value.toString())
        this.checkString()
        this.checkIfStringContainsNumbers()
    }

}