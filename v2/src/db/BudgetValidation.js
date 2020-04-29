const validator = require('validator')
module.exports = class Budget {
    constructor(bodyArray) {
        this.type = bodyArray.type ? bodyArray.type : '';
        this.description = bodyArray.description ? bodyArray.description : '';
        this.value = bodyArray.value ? bodyArray.value : '';
        this.error = []
    }

    checkEmpty(p) {
        if (validator.isEmpty(p)) {
            return this.error.push({
                error: 'A parameter should not be empty'
            })
        }
    }

    checkIfStringContainsNumbers() {
        if (validator.isHexadecimal(this.type)) {
            return this.error.push({
                error:'Type should not contain a number'
            })
        }
    }

    checkString() {
        if (typeof this.value === 'string') {
            this.value = parseInt(this.value)
        }
    }

    // checkType() {
    //     const typesArray = ["inc", "exp", "sav"]
    //
    //     for (let el of typesArray) {
    //         console.log(el)
    //         if (!el.includes(this.type)) {
    //             return this.error.push({
    //                 error: 'type must be inc, exp, sav'
    //             })
    //
    //         }
    //     }
    // }
    returnInput() {
        this.checkEmpty(this.type)
        this.checkEmpty(this.description)
        this.checkEmpty(this.value.toString())
        this.checkString()
        this.checkIfStringContainsNumbers()
        if(this.error.length === 0) {
            return {
                budget_type: this.type.toString(),
                budget_description: this.description.toString(),
                budget_value: this.value
            }
        } else {
            return {
                budget_type: this.type.toString(),
                budget_description: this.description.toString(),
                budget_value: this.value,
                error: this.error
            }
        }
    }



    returnJSON() {





    }
}