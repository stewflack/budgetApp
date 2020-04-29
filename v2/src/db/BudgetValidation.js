const validator = require('validator')
module.exports = class Budget {
    constructor(body) {
        this.type = body.type ? body.type : '';
        this.description = body.description ? body.description : '';
        this.value = body.value ? body.value : '';
        this.error = [];
    }

    checkEmpty(p) {
        if (validator.isEmpty(p)) {
            return this.error.push({
                error: 'A parameter should not be empty'
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



    returnJSON() {
        this.checkEmpty(this.type)
        this.checkEmpty(this.description)
        this.checkEmpty(this.value.toString())
        this.checkString()

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
}