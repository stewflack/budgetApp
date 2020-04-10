import Expense from './Expense';
import Income from './Income';
import Savings from './Savings';

export default class Budget {
    constructor() {
        this.allItems = {
            exp: localStorage.getItem('allItems-exp') != null ? this.getLocalStorage('allItems', 'exp', Expense) : [],
            inc: localStorage.getItem('allItems-inc') != null ? this.getLocalStorage('allItems', 'inc', Income)  : [],
            sav: localStorage.getItem('allItems-sav') != null ? this.getLocalStorage('allItems', 'sav', Savings)  : []
        };
        this.totals = {
            exp: localStorage.getItem('totals-exp') != null ? parseInt(localStorage.getItem('totals-exp')) : 0,
            inc: localStorage.getItem('totals-inc') != null ? parseInt(localStorage.getItem('totals-inc')) : 0,
            sav: localStorage.getItem('totals-sav') != null ? parseInt(localStorage.getItem('totals-sav')) : 0
        };
        this.budget = localStorage.getItem('budget') != null ? parseInt(localStorage.getItem('budget')) : 0;
        this.percentage = {
            exp: localStorage.getItem('percentage-exp') != null ? parseInt(localStorage.getItem('percentage-exp')) : -1,
            sav: localStorage.getItem('percentage-sav') != null ? parseInt(localStorage.getItem('percentage-sav')) : -1
        };
    }

    calculateTotal(type) {
        var sum = 0;
        this.allItems[type].forEach(curr => {
            sum += curr.value;
        });

        this.totals[type] = sum;
    }

    addItem(type, desc, val) {
        var newItem, ID;
        //create new ID
        if(this.allItems[type].length > 0 ) {
            ID = this.allItems[type][this.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }

        // Create data based on type
        if (type === 'exp') {
            newItem = new Expense(ID, desc, val);
        } else if (type === 'inc') {
            newItem = new Income(ID, desc, val);
        } else if (type === 'sav') {
            newItem = new Savings(ID, desc, val);
        }
        // push into data structure
        this.allItems[type].push(newItem);
        // return the new element
        return newItem;
    }
    deleteItem(type, id) {
        var ids, index;
        ids = this.allItems[type].map(current => {
            return current.id;
        });

        index = ids.indexOf(id);

        if(index !== -1) {
            // first parameter is the position in the array, 2nd is the number of elements
            this.allItems[type].splice(index, 1);
        }
    }
    getItem(type) {
        return this.allItems[type].map(curr => {
            return curr;
        });
    }
    // data to be an object
    editItem(type ,id, data) {
        const ids = this.allItems[type].map(curr => {
            return curr.id;
        });

        const index = ids.indexOf(id);
        const item = this.allItems[type][index];
        /* New Object */
        const newDesc = data.description;
        const newValue = data.value;
        console.log(data.value);

        if (newDesc!=='' || newDesc.length === 0) {
            item.description = newDesc;
        }

        if (!isNaN(newValue)) {
            if (newValue > 0) {
                item.value = newValue;
            } else {
                // Error Handling
                console.log('Enter a number which is higher than 0');
            }
        } else {
            console.log('Value empty');
        }


         console.log('Edit data side complete');
        return [item.description, item.value];
    }

    calculateBudget() {
        // total income and expenses
        this.calculateTotal('inc');
        this.calculateTotal('exp');
        this.calculateTotal('sav');
        // total budget income - expenses
        this.budget = this.totals.inc - (this.totals.exp + this.totals.sav);
        if( this.totals.inc > 0) {
            // total % of income spent
            this.percentage.exp = Math.round((this.totals.exp / this.totals.inc) * 100);
            this.percentage.sav = Math.round((this.totals.sav / this.totals.inc) * 100);
        } else {
            this.percentage.exp = -1;
            this.percentage.sav = -1;
        }
    }


    calaculatePercentages() {
        this.allItems.exp.forEach(curr => {
            curr.calcPercentage(this.totals.inc);
        });

        this.allItems.sav.forEach(curr => curr.calcPercentage(this.totals.inc));
    }
    getExpensePercentages(){
        return this.allItems.exp.map(curr => {
            return curr.getPercentage()
        });
    }
    getSavingsPercentages(){
        return this.allItems.sav.map(curr => {
            return curr.getPercentage()
        });
    }
    // get
    getBudget(){
        return {
            budget: this.budget,
            totalIncome: this.totals.inc,
            totalExpense: this.totals.exp,
            totalSavings: this.totals.sav,
            percentageExpense: this.percentage.exp,
            percentageSavings: this.percentage.sav
        }
    }
    storeLocalStorage() {
        localStorage.setItem('allItems-inc', JSON.stringify(this.allItems.inc));
        localStorage.setItem('allItems-exp', JSON.stringify(this.allItems.exp));
        localStorage.setItem('allItems-sav', JSON.stringify(this.allItems.sav));
        localStorage.setItem('totals-inc', JSON.stringify(this.totals.inc));
        localStorage.setItem('totals-exp', JSON.stringify(this.totals.exp));
        localStorage.setItem('totals-sav', JSON.stringify(this.totals.sav));
        localStorage.setItem('budget', JSON.stringify(this.budget));
        localStorage.setItem('percentage-exp', JSON.stringify(this.percentage.exp));
        localStorage.setItem('percentage-sav', JSON.stringify(this.percentage.sav));
    }

    getLocalStorage(area, type, Obj) {
        const array = JSON.parse(localStorage.getItem(`${area}-${type}`)); //allItems-inc
        if (array !== null ) {
            const newArray = array.map(curr => {
                return new Obj(curr.id, curr.description, curr.value);
            });
            return newArray;
        }

    }
}
