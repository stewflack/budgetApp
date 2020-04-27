(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    editBtn: '.edit__btn',
    editItemBtn: '.item__edit--btn',
    deleteItemBtn: '.item__delete--btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    savingsContainer: '.savings__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    savingsLabel: '.budget__savings--value',
    incomePercentLabel: '.budget__income--percentage',
    expensePercentLabel: '.budget__expenses--percentage',
    savingsPercentLabel: '.budget__savings--percentage',
    container: '.container',
    expensesPercentageLabel: '.expenses__item__percentage',
    savingsPercentageLabel: '.savings__item__percentage',
    dateLabel: '.budget__title--month'
};
 const convertBudgetType = type => {
    switch (type) {
        case 'inc':
            return 'Income';
        case 'exp':
            return 'Expense';
        case 'sav':
            return 'Savings';
    }
};

module.exports = {
    DOMstrings,
    convertBudgetType
}
},{}],2:[function(require,module,exports){
// import {DOMstrings, convertBudgetType} from "./base";
const base = require('./base')
// import Budget from '../../src/js/models/Budget';
const Budget = require('./models/Budget')
// import * as budgetView from '../../src/js/views/budgetView';
const budgetView = require('../js/views/budgetView')
// import {changeType} from "../../src/js/views/budgetView";
// import {getInput} from "../../src/js/views/budgetView";
// import * as notification from '../../src/js/views/Notifications';
const notification = require('../js/views/Notifications')
const {getInput} = require("./views/budgetView");
const {convertBudgetType} = require("./base");

const state = {};
window.state = state;
/**** BUDGET CONTROLLER ******/
const budgetController = () => {
    if(!state.budget) state.budget = new Budget();
    const updateBudget = () => {

        // Calculate the Budget
        state.budget.calculateBudget();
        // Return Budget
        const budget = state.budget.getBudget();
        // Update the UI
        budgetView.displayBudget(budget);
    };

    const updatePercentages = () => {
        // Calculate Percentages
        state.budget.calaculatePercentages();
        // Read from the budget model
        const expensePercentages = state.budget.getExpensePercentages();
        const savingsPercentages = state.budget.getSavingsPercentages();
        // Update the UI
        budgetView.displayPercentage(expensePercentages);
        budgetView.displaySavingsPercent(savingsPercentages);
    };

    const ctrlAddItem = () => {
        let input, newItem;
        // 1. Get the field input dat
        input = budgetView.getInput();
        if(input.description !== '' && input.value !== '' && input.value > 0 && !isNaN(input.value)) {
            // 2 Add the item to the budget controller
            newItem = state.budget.addItem(input.type, input.description, input.value);
            // 3 add the item to the user interface
            budgetView.addListItem(newItem, input.type);
            // 4 Clear the fields
            budgetView.clearFields();

            let type = base.convertBudgetType(input.type);
            let prefix = input.type !== 'sav' ? 'An' : 'A';
            // notification.createNotification('success', `${prefix} <strong>${type}</strong> has been created`, '');


            // call and calculate budget
            updateBudget();

            // update percentages
            updatePercentages();
            // Update Local Storage
            state.budget.storeLocalStorage();
        } else {
            // Error Handling
            // notification.createNotification('alert', 'Please fill in the required input fields', '', 3000);
            budgetView.focusFields()
        }

    };
    const ctrlDeleteItem = () => {
        let itemID, splitID, type, id;
        /*
         Not the best way to complete as we have hardcoded the HTML to be this way, If we add in something else
         then the chain will change
         */
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // if the element has an ID then do something
        if (itemID) {
            // returns an array
            splitID = itemID.split('-'); // split the string and store in an array
            type = splitID[0]; // inc/exp
            console.log(type);
            id = parseInt(splitID[1]); // number

            // 1. Delete item from data structure
            state.budget.deleteItem(type, id);
            // 2. delete item from UI
            budgetView.deleteListItem(itemID);


            /* Get the type and output full in notification  */
            type = convertBudgetType(type);
            // notification.createNotification('info', `<strong>${type}</strong> has been deleted`,'');
            // 3. Update and show the new budget
            updateBudget();

            updatePercentages();
            // Update Local Storage
            state.budget.storeLocalStorage();
        } else {
            console.log('Item ID not found')
        }
    };

    /***
     * Edit Item
     */

    const ctrlEditItem = () => {
        let itemID, splitID, type, id;
        /*
         Not the best way to complete as we have hardcoded the HTML to be this way, If we add in something else
         then the chain will change
         */
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // if the element has an ID then do something
        if (itemID) {
            // returns an array
            splitID = itemID.split('-'); // split the string and store in an array
            type = splitID[0]; // inc/exp/sav
            id = parseInt(splitID[1]); // number

            localStorage.setItem('type', type);
            localStorage.setItem('itemId', splitID[1]);

            const data = state.budget.getItem(type); //returns object

            // Fix for when an item has been deleted
            const obj = data.find(o => {
                if (o.id === id) {
                    return o;
                }
            });
            // Update Input
            budgetView.clearFields();
            budgetView.focusFields();
            budgetView.updateInputs(obj.description, obj.value);
            budgetView.toggleBtn();

            /* Get the type and output full in notification  */
            type = convertBudgetType(type);
            // notification.createNotification('info', `Edit the <strong>${type}</strong> from the input fields`, '');
        } else {
            console.log('Item ID not found')
        }
    };
    const submitEditItem = () => {
        let idStorage = localStorage.getItem('itemId');
        const id = parseInt(idStorage);
        let type = localStorage.getItem('type');

        const newData = {
            description: getInput().description,
            value: !isNaN(getInput().value) ? getInput().value : ''
        };
        const [desc, value] = state.budget.editItem(type, id, newData);
        localStorage.removeItem('itemId');
        localStorage.removeItem('type');

        budgetView.updateItem(type, idStorage, desc, value);
        budgetView.clearFields();
        budgetView.toggleBtn();

        type = convertBudgetType(type);
        // notification.createNotification('info', `<strong>${type}</strong> has been updated`, '');

        updateBudget();

        updatePercentages();
        // Update Local Storage
        state.budget.storeLocalStorage();
    };

    const setupEventListeners = () =>{
        const DOM = base.DOMstrings;

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        /***
         * TODO: Edit is not working off a enter at the moment
         */
        document.addEventListener('keypress',  event => {
            if(event.keyCode === 13 || event.which === 13) {
                const add = document.getElementById('add_btn');
                const edit = document.getElementById('edit_btn');
                /* Check which button is shown to the user */
                if (add.classList.contains('btnDisplay')) {
                    ctrlAddItem();
                } else if (edit.classList.contains('btnDisplay')) {
                    ctrlEditItem();
                }
            }
        });

        document.querySelector(DOM.container).addEventListener('click', e => {
            console.log(e.target.parentNode.className);
            if(e.target.parentNode.className === DOM.deleteItemBtn.replace('.', '')) {
                ctrlDeleteItem();
            } else if (e.target.parentNode.className === DOM.editItemBtn.replace('.', '')) {
                ctrlEditItem();
            }
        });
        document.getElementById('edit_btn').addEventListener('click', submitEditItem);
        document.querySelector(DOM.inputType).addEventListener('change', budgetView.changeType)
    };

    return {
        init: () => {
            // Budget.getLocalStorage();
            console.log('The application has started');
            budgetView.displayMonth();
            budgetView.displayBudget({
                budget: state.budget.budget,
                totalIncome: state.budget.totals.inc,
                totalExpense: state.budget.totals.exp,
                totalSavings: state.budget.totals.sav,
                percentage: state.budget.percentage
            });

            /**
             * TODO Improve the below code
             */
            state.budget.allItems.inc.forEach(curr => {
                budgetView.addListItem(curr, 'inc');
            });
            state.budget.allItems.exp.forEach(curr => {
                budgetView.addListItem(curr, 'exp');
            });
            state.budget.allItems.sav.forEach(curr => {
                budgetView.addListItem(curr, 'sav');
            });
            updateBudget();

            setupEventListeners();
        }
    }
};

budgetController().init();




},{"../js/views/Notifications":7,"../js/views/budgetView":8,"./base":1,"./models/Budget":3,"./views/budgetView":8}],3:[function(require,module,exports){
const Expense = require('./Expense');
const Income = require('./Income');
const Savings = require('./Savings');

module.exports = class Budget {
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

},{"./Expense":4,"./Income":5,"./Savings":6}],4:[function(require,module,exports){
module.exports = class Expense {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    calcPercentage(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    getPercentage() {
        return this.percentage;
    }

}
},{}],5:[function(require,module,exports){
module.exports = class Income {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
}
},{}],6:[function(require,module,exports){
module.exports = class Savings {

    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    calcPercentage(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    getPercentage() {
        return this.percentage;
    }

}

},{}],7:[function(require,module,exports){
const AWN = require("awesome-notifications");

function createNotification(type, message, l, dur = 2000){
    const options = {
        position: "top-right",
        durations: {global: dur},
        enabled: true,
        labels: {
            info: l,
            tip: l,
            success: l,
            warning: l,
            alert: l
        }
    }, awn = new AWN(options);

    switch (type) {
        case 'tip':
            awn.tip(message);
            break;
        case 'info':
            awn.info(message);
            break;
        case 'success':
            awn.success(message); // awn.success(message, {}); to override use this
            break;
        case 'warning':
            awn.warning(message);
            break;
        case 'alert':
            awn.alert(message);
            break;
    }
}

module.exports = createNotification
},{"awesome-notifications":9}],8:[function(require,module,exports){
const base =  require("../base")
function each(arr, percent) {
    arr.forEach((curr, i) => {
        if (percent[i] > 0) {
            curr.textContent = percent[i] + '%';
        } else {
            curr.textContent = '---';
        }
    });
}
const formatNumber = (num, type) => {
    /*******
     * + or - before the number,
     * exactly 2 decimal points
     * comma separating the thousands
     */
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2); // returns a string

    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
        int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3); // 2310, output = 2,310
    }

    //type === 'exp' ? sign = '-' : sign = '+';
    return (type === 'exp' ? '-' :'+') + ' ' + int + '.' + dec;
};
/**** FOR EACH *****/
const nodeListForEach = (list, callback) => {
    for(var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
};

const getInput = () => {
  return {
      type: document.querySelector(base.DOMstrings.inputType).value, // Will be either inc or exp
      description: document.querySelector(base.DOMstrings.inputDescription).value,
      value: parseFloat(document.querySelector(base.DOMstrings.inputValue).value)
  };
};

const addListItem = (obj, type) => {
    let markup, element;
    // create a HTML string with placeholder text
    if(type === 'inc') {
        element = base.DOMstrings.incomeContainer;
        markup = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div>\n<div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'exp') {
        element = base.DOMstrings.expenseContainer;
        markup = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.value}</div><div class="expenses__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'sav') {
        element = base.DOMstrings.savingsContainer;
        markup = `<div class="item clearfix" id="sav-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.value}</div><div class="savings__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    }
    // Insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', markup);
};


const deleteListItem = selectorID => {
    const el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
};

const clearFields = () => {
    var fields, fieldsArray;
    fields = document.querySelectorAll(base.DOMstrings.inputValue +','+ base.DOMstrings.inputDescription);
    // the above returns a list

    fieldsArray = Array.prototype.slice.call(fields);
    //pass in a callback funtion and then is applied to each item in the array
    fieldsArray.forEach((currentValue) => {

        currentValue.value = '';

    });
    fieldsArray[0].focus();
};

const displayBudget = obj => {

    let type;
    obj.budget > 0 ? type = 'inc' : type = 'exp';
    // Budget total label
    const {expenseLabel, budgetLabel, incomeLabel, expensePercentLabel, savingsPercentLabel, savingsLabel} = base.DOMstrings;
    document.querySelector(budgetLabel).textContent = formatNumber(obj.budget, type);

    document.querySelector(incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
    document.querySelector(savingsLabel).textContent = formatNumber(obj.totalSavings, 'sav');
    document.querySelector(expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');

    if (obj.percentageExpense > 0 || obj.percentageSavings > 0) {
        document.querySelector(expensePercentLabel).textContent = obj.percentageExpense+'%';
        document.querySelector(savingsPercentLabel).textContent = obj.percentageSavings+'%';
    }  else {
        document.querySelector(expensePercentLabel).textContent = '---';
        document.querySelector(savingsPercentLabel).textContent = '---';
    }

};


const displayPercentage = percentages => {
    let fields = document.querySelectorAll(base.DOMstrings.expensesPercentageLabel);
    each(fields, percentages);
};
const displaySavingsPercent = percentages => {
    let fields = document.querySelectorAll(base.DOMstrings.savingsPercentageLabel);
    each(fields, percentages);
};

const displayMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December'];
    const month = now.getMonth();
    // return month + ' ' + year;
    document.querySelector(base.DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
};
const inputFocusColour = (arr, style) => {
    arr.forEach(curr => {
        curr.addEventListener("focusin",() => {
            curr.style.border = style;
        });
        curr.addEventListener("focusout", () => {
            curr.style.border = '1px solid #e7e7e7';
        });
    });
};


const changeType = () => {
    /*Select Type Input*/
    const type = base.DOMstrings.inputType;
    const select = document.getElementById('addType');

    // Array of Classes
    const fields = document.querySelectorAll(
        type + ',' +
        base.DOMstrings.inputDescription + ',' +
        base.DOMstrings.inputValue);

    if (select.options[select.selectedIndex].value === 'sav') {

        inputFocusColour(fields, '1px solid #0f76c1');
        document.querySelector(base.DOMstrings.inputBtn).style.color = '#0f76c1';
        document.querySelector(base.DOMstrings.editBtn).style.color = '#0f76c1';
    } else if (select.options[select.selectedIndex].value === 'exp') {

        inputFocusColour(fields, '1px solid #FF5049');
        document.querySelector(base.DOMstrings.inputBtn).style.color = '#FF5049';
        document.querySelector(base.DOMstrings.editBtn).style.color = '#FF5049';

    } else if (select.options[select.selectedIndex].value === 'inc') {

        inputFocusColour(fields, '1px solid #28B9B5');
        document.querySelector(base.DOMstrings.inputBtn).style.color = '#28B9B5';
        document.querySelector(base.DOMstrings.editBtn).style.color = '#28B9B5';

    }

    document.getElementById('addDesc').focus();

};

const focusFields = () => {
    const fields = document.querySelectorAll(base.DOMstrings.inputValue +','+ base.DOMstrings.inputDescription);
    // the above returns a list
    // TODO what was the ES6 way of doing this
    const fieldsArray = Array.prototype.slice.call(fields);
    /* Focus on Desc field */
    fieldsArray[0].focus();
};
/***
 * Toggle the disabled select
 */
const toggleDisable = el => {
    if (el.disabled === false) {
        el.disabled = true;
        el.style.cursor = 'no-drop';
    } else if (el.disabled) {
        el.disabled = false;
        el.style.cursor = 'auto';
    }

};

const updateInputs = (desc, value) => {
    if (!document.querySelector(base.DOMstrings.inputType).disabled) {
        toggleDisable(document.querySelector(base.DOMstrings.inputType));
        document.querySelector(base.DOMstrings.inputValue).value = value.toString();
        document.querySelector(base.DOMstrings.inputDescription).value = desc;
    }
};
/*
TODO - this will need to be improved but a good way for now while the items are not changing
 */
const updateItem = (type, id, d, v) => {
    const combinedID = document.getElementById(`${type}-${id}`);

    const desc = combinedID.childNodes[0];
    let value;
    if (type === 'inc') {
        value = combinedID.childNodes[2].childNodes[1];
    } else {
        value = combinedID.childNodes[1].childNodes[1];
    }
    desc.textContent = d;
    value.textContent = v;

    toggleDisable(document.querySelector(base.DOMstrings.inputType));
};
/***
 * Toggle button to be complete edit and add new item
 */
// console.log(DOMstrings.inputBtn);

const toggleBtn = () => {
    const add = document.getElementById('add_btn');
    const edit = document.getElementById('edit_btn');
    if (add.classList.contains('btnDisplay')) {
        add.classList.remove('btnDisplay');
        edit.classList.add('btnDisplay');
        // Disable the delete Button
        document.querySelector(base.DOMstrings.deleteItemBtn).disabled = true;
        document.querySelector(base.DOMstrings.deleteItemBtn).parentNode.style.cursor = 'no-drop';
        document.querySelector(base.DOMstrings.deleteItemBtn).style.pointerEvents = 'none';
    } else if (edit.classList.contains('btnDisplay')) {
        edit.classList.remove('btnDisplay');
        add.classList.add('btnDisplay');

        document.querySelector(base.DOMstrings.deleteItemBtn).disabled = false;
        document.querySelector(base.DOMstrings.deleteItemBtn).parentNode.style.cursor = 'auto';
        document.querySelector(base.DOMstrings.deleteItemBtn).style.pointerEvents = 'auto';
    }
};
module.exports = {
    getInput,
    addListItem,
    deleteListItem,
    clearFields,
    displayBudget,
    displayMonth,
    displayPercentage,
    displaySavingsPercent,
    changeType,
    focusFields,
    updateInputs,
    updateItem,
    toggleBtn
}




},{"../base":1}],9:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.AWN=e():t.AWN=e()}(window,function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}n.r(e);var r={maxNotifications:10,animationDuration:300,position:"bottom-right",labels:{tip:"Tip",info:"Info",success:"Success",warning:"Attention",alert:"Error",async:"Loading",confirm:"Confirmation required",confirmOk:"OK",confirmCancel:"Cancel"},icons:{tip:"question-circle",info:"info-circle",success:"check-circle",warning:"exclamation-circle",alert:"exclamation-triangle",async:"cog fa-spin",confirm:"exclamation-triangle",prefix:"<i class='fa fas fa-fw fa-",suffix:"'></i>",enabled:!0},replacements:{tip:null,info:null,success:null,warning:null,alert:null,async:null,"async-block":null,modal:null,confirm:null,general:{"<script>":"","<\/script>":""}},messages:{tip:"",info:"",success:"Action has been succeeded",warning:"",alert:"Action has been failed",confirm:"This action can't be undone. Continue?",async:"Please, wait...","async-block":"Loading"},formatError:function(t){if(t.response){if(!t.response.data)return"500 API Server Error";if(t.response.data.errors)return t.response.data.errors.map(function(t){return t.detail}).join("<br>");if(t.response.statusText)return"".concat(t.response.status," ").concat(t.response.statusText,": ").concat(t.response.data)}return t.message?t.message:t},durations:{global:5e3,success:null,info:null,tip:null,warning:null,alert:null},minDurations:{async:1e3,"async-block":1e3}},a=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Object.assign(this,this.defaultsDeep(n,e))}var e,n,a;return e=t,(n=[{key:"icon",value:function(t){return this.icons.enabled?"".concat(this.icons.prefix).concat(this.icons[t]).concat(this.icons.suffix):""}},{key:"label",value:function(t){return this.labels[t]}},{key:"duration",value:function(t){var e=this.durations[t];return null===e?this.durations.global:e}},{key:"toSecs",value:function(t){return"".concat(t/1e3,"s")}},{key:"applyReplacements",value:function(t,e){if(!t)return this.messages[e]||"";for(var n=0,o=["general",e];n<o.length;n++){var i=o[n];if(this.replacements[i])for(var r in this.replacements[i])t=t.replace(r,this.replacements[i][r])}return t}},{key:"override",value:function(e){return e?new t(e,this):this}},{key:"defaultsDeep",value:function(t,e){var n={};for(var i in t)e.hasOwnProperty(i)?n[i]="object"===o(t[i])&&null!==t[i]?this.defaultsDeep(t[i],e[i]):e[i]:n[i]=t[i];return n}}])&&i(e.prototype,n),a&&i(e,a),t}(),s={popup:"".concat("awn","-popup"),toast:"".concat("awn","-toast"),btn:"".concat("awn","-btn"),confirm:"".concat("awn","-confirm")},c={prefix:s.toast,klass:{label:"".concat(s.toast,"-label"),content:"".concat(s.toast,"-content"),icon:"".concat(s.toast,"-icon"),progressBar:"".concat(s.toast,"-progress-bar"),progressBarPause:"".concat(s.toast,"-progress-bar-paused")},ids:{container:"".concat(s.toast,"-container")}},u={prefix:s.popup,klass:{buttons:"".concat("awn","-buttons"),button:s.btn,successBtn:"".concat(s.btn,"-success"),cancelBtn:"".concat(s.btn,"-cancel"),title:"".concat(s.popup,"-title"),body:"".concat(s.popup,"-body"),content:"".concat(s.popup,"-content"),dotAnimation:"".concat(s.popup,"-loading-dots")},ids:{wrapper:"".concat(s.popup,"-wrapper"),confirmOk:"".concat(s.confirm,"-ok"),confirmCancel:"".concat(s.confirm,"-cancel")}},l={klass:{hiding:"".concat("awn","-hiding")},lib:"awn"};function f(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var p=function(){function t(e,n,o,i,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.newNode=document.createElement("div"),n&&(this.newNode.id=n),o&&(this.newNode.className=o),i&&(this.newNode.style.cssText=i),this.parent=e,this.options=r}var e,n,o;return e=t,(n=[{key:"beforeInsert",value:function(){}},{key:"afterInsert",value:function(){}},{key:"insert",value:function(){return this.beforeInsert(),this.el=this.parent.appendChild(this.newNode),this.afterInsert(),this}},{key:"replace",value:function(t){var e=this;if(this.getElement())return this.beforeDelete().then(function(){return e.updateType(t.type),e.parent.replaceChild(t.newNode,e.el),e.el=e.getElement(t.newNode),e.afterInsert(),e})}},{key:"beforeDelete",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.el,n=0;return this.start&&(n=this.options.minDurations[this.type]+this.start-Date.now())<0&&(n=0),new Promise(function(o){setTimeout(function(){e.classList.add(l.klass.hiding),setTimeout(o,t.options.animationDuration)},n)})}},{key:"delete",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.el;return this.getElement(e)?this.beforeDelete(e).then(function(){e.remove(),t.afterDelete()}):null}},{key:"afterDelete",value:function(){}},{key:"getElement",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.el;return document.getElementById(t.id)}},{key:"addEvent",value:function(t,e){this.el.addEventListener(t,e)}},{key:"toggleClass",value:function(t){this.el.classList.toggle(t)}},{key:"updateType",value:function(t){this.type=t,this.duration=this.options.duration(this.type)}}])&&f(e.prototype,n),o&&f(e,o),t}();function d(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var y=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.callback=e,this.remaining=n,this.resume()}var e,n,o;return e=t,(n=[{key:"pause",value:function(){this.paused=!0,window.clearTimeout(this.timerId),this.remaining-=new Date-this.start}},{key:"resume",value:function(){var t=this;this.paused=!1,this.start=new Date,window.clearTimeout(this.timerId),this.timerId=window.setTimeout(function(){window.clearTimeout(t.timerId),t.callback()},this.remaining)}},{key:"toggle",value:function(){this.paused?this.resume():this.pause()}}])&&d(e.prototype,n),o&&d(e,o),t}();function h(t){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function m(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function b(t,e){return!e||"object"!==h(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function k(t,e){return(k=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g=function(t){function e(t,n,o,i){var r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(r=b(this,v(e).call(this,i,"".concat(c.prefix,"-").concat(Math.floor(Date.now()-100*Math.random())),"".concat(c.prefix," ").concat(c.prefix,"-").concat(n),"animation-duration: ".concat(o.toSecs(o.animationDuration),";"),o))).updateType(n),r.setInnerHtml(t),r}var n,o,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&k(t,e)}(e,p),n=e,(o=[{key:"setInnerHtml",value:function(t){"alert"===this.type&&t&&(t=this.options.formatError(t)),t=this.options.applyReplacements(t,this.type),this.newNode.innerHTML='<div class="awn-toast-wrapper">'.concat(this.progressBar).concat(this.label,'<div class="').concat(c.klass.content,'">').concat(t,'</div><span class="').concat(c.klass.icon,'">').concat(this.options.icon(this.type),"</span></div>")}},{key:"beforeInsert",value:function(){var t=this;if(this.parent.childElementCount>=this.options.maxNotifications){var e=Array.from(this.parent.getElementsByClassName(c.prefix));this.delete(e.find(function(e){return!t.isDeleted(e)}))}}},{key:"afterInsert",value:function(){var t=this;if("async"==this.type)return this.start=Date.now();if(this.addEvent("click",function(){return t.delete()}),!(this.duration<=0)){this.timer=new y(function(){return t.delete()},this.duration);for(var e=0,n=["mouseenter","mouseleave"];e<n.length;e++){var o=n[e];this.addEvent(o,function(){t.isDeleted()||(t.toggleClass(c.klass.progressBarPause),t.timer.toggle())})}}}},{key:"isDeleted",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.el).classList.contains(l.klass.hiding)}},{key:"progressBar",get:function(){return this.duration<=0||"async"===this.type?"":"<div class='".concat(c.klass.progressBar,"' style=\"animation-duration:").concat(this.options.toSecs(this.duration),';"></div>')}},{key:"label",get:function(){return'<b class="'.concat(c.klass.label,'">').concat(this.options.label(this.type),"</b>")}}])&&m(n.prototype,o),i&&m(n,i),e}();function w(t){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function O(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _(t,e){return!e||"object"!==w(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function T(t){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function E(t,e){return(E=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var S=function(t){function e(t){var n,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"modal",i=arguments.length>2?arguments[2]:void 0,r=arguments.length>3?arguments[3]:void 0,a=arguments.length>4?arguments[4]:void 0;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var s="animation-duration: ".concat(i.toSecs(i.animationDuration),";");return(n=_(this,T(e).call(this,document.body,u.ids.wrapper,null,s,i)))[u.ids.confirmOk]=r,n[u.ids.confirmCancel]=a,n.className="".concat(u.prefix,"-").concat(o),["confirm","async-block","modal"].includes(o)||(o="modal"),n.updateType(o),n.setInnerHtml(t),n.insert(),n}var n,o,i;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&E(t,e)}(e,p),n=e,(o=[{key:"setInnerHtml",value:function(t){var e=this.options.applyReplacements(t,this.type);switch(this.type){case"confirm":var n=["<button class='".concat(u.klass.button," ").concat(u.klass.successBtn,"'id='").concat(u.ids.confirmOk,"'>").concat(this.options.labels.confirmOk,"</button>")];!1!==this[u.ids.confirmCancel]&&n.push("<button class='".concat(u.klass.button," ").concat(u.klass.cancelBtn,"'id='").concat(u.ids.confirmCancel,"'>").concat(this.options.labels.confirmCancel,"</button>")),e="".concat(this.options.icon(this.type),"<div class='").concat(u.klass.title,"'>").concat(this.options.label(this.type),'</div><div class="').concat(u.klass.content,'">').concat(e,"</div><div class='").concat(u.klass.buttons," ").concat(u.klass.buttons,"-").concat(n.length,"'>").concat(n.join(""),"</div>");break;case"async-block":e="".concat(e,'<div class="').concat(u.klass.dotAnimation,'"></div>')}this.newNode.innerHTML='<div class="'.concat(u.klass.body," ").concat(this.className,'">').concat(e,"</div>")}},{key:"keyupListener",value:function(t){if("async-block"===this.type)return t.preventDefault();switch(t.code){case"Escape":t.preventDefault(),this.delete();case"Tab":if(t.preventDefault(),"confirm"!==this.type||!1===this[u.ids.confirmCancel])return!0;var e=this.okBtn;t.shiftKey?document.activeElement.id==u.ids.confirmOk&&(e=this.cancelBtn):document.activeElement.id!==u.ids.confirmCancel&&(e=this.cancelBtn),e.focus()}}},{key:"afterInsert",value:function(){var t=this;switch(this.listener=function(e){return t.keyupListener(e)},window.addEventListener("keydown",this.listener),this.type){case"async-block":this.start=Date.now();break;case"confirm":this.okBtn.focus(),this.addEvent("click",function(e){if("BUTTON"!==e.target.nodeName)return!1;t.delete(),t[e.target.id]&&t[e.target.id]()});break;default:document.activeElement.blur(),this.addEvent("click",function(e){e.target.id===t.newNode.id&&t.delete()})}}},{key:"afterDelete",value:function(){window.removeEventListener("keydown",this.listener)}},{key:"okBtn",get:function(){return document.getElementById(u.ids.confirmOk)}},{key:"cancelBtn",get:function(){return document.getElementById(u.ids.confirmCancel)}}])&&O(n.prototype,o),i&&O(n,i),e}();function j(t){return(j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function x(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}n.d(e,"default",function(){return C});var C=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.options=new a(e)}var e,n,o;return e=t,(n=[{key:"tip",value:function(t,e){return this._addToast(t,"tip",e).el}},{key:"info",value:function(t,e){return this._addToast(t,"info",e).el}},{key:"success",value:function(t,e){return this._addToast(t,"success",e).el}},{key:"warning",value:function(t,e){return this._addToast(t,"warning",e).el}},{key:"alert",value:function(t,e){return this._addToast(t,"alert",e).el}},{key:"async",value:function(t,e,n,o,i){var r=this._addToast(o,"async",i);return this._afterAsync(t,e,n,i,r)}},{key:"confirm",value:function(t,e,n,o){return this._addPopup(t,"confirm",o,e,n)}},{key:"asyncBlock",value:function(t,e,n,o,i){var r=this._addPopup(o,"async-block",i);return this._afterAsync(t,e,n,i,r)}},{key:"modal",value:function(t,e,n){return this._addPopup(t,e,n)}},{key:"closeToasts",value:function(){for(var t=this.container;t.firstChild;)t.removeChild(t.firstChild)}},{key:"_addPopup",value:function(t,e,n,o,i){return new S(t,e,this.options.override(n),o,i)}},{key:"_addToast",value:function(t,e,n,o){n=this.options.override(n);var i=new g(t,e,n,this.container);return o?o instanceof S?o.delete().then(function(){return i.insert()}):o.replace(i):i.insert()}},{key:"_afterAsync",value:function(t,e,n,o,i){return t.then(this._responseHandler(e,"success",o,i),this._responseHandler(n,"alert",o,i))}},{key:"_responseHandler",value:function(t,e,n,o){var i=this;return function(r){switch(j(t)){case"undefined":case"string":var a="alert"===e?t||r:t;i._addToast(a,e,n,o);break;default:o.delete().then(function(){t&&t(r)})}}}},{key:"_createContainer",value:function(){return new p(document.body,c.ids.container,"awn-".concat(this.options.position)).insert().el}},{key:"container",get:function(){return document.getElementById(c.ids.container)||this._createContainer()}}])&&x(e.prototype,n),o&&x(e,o),t}()}])});
},{}]},{},[2]);
