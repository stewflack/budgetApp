import Expense from './Expense';
import Income from './Income';
import Savings from './Savings';

export default class Budget {
    constructor() {
        this.allItems = {
            exp:[],
            inc:[],
            sav:[]
        };
        this.totals = {
            exp: 0,
            inc:0,
            sav:0
        };
        this.budget =0;
        this.percentage= -1;
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
    calculateBudget() {
        // total income and expenses
        this.calculateTotal('inc');
        this.calculateTotal('exp');
        this.calculateTotal('sav');
        // total budget income - expenses
        this.budget = this.totals.inc - (this.totals.exp + this.totals.sav);
        if( this.totals.inc > 0) {
            // total % of income spent
            this.percentage = Math.round((this.totals.exp / this.totals.inc) * 100);
        } else {
            this.percentage = -1;
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
            percentage: this.percentage
        }
    }
}
