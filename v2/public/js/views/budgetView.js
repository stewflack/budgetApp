const base = require("../base")
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
        markup = `<div class="item clearfix" id="inc-${obj.budget_id}"><div class="item__description">${obj.budget_description}</div>\n<div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.budget_value}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'exp') {
        element = base.DOMstrings.expenseContainer;
        markup = `<div class="item clearfix" id="exp-${obj.budget_id}"><div class="item__description">${obj.budget_description}</div><div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.budget_value}</div><div class="expenses__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'sav') {
        element = base.DOMstrings.savingsContainer;
        markup = `<div class="item clearfix" id="sav-${obj.budget_id}"><div class="item__description">${obj.budget_description}</div><div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.budget_value}</div><div class="savings__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
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
    obj.budgetTotal > 0 ? type = 'inc' : type = 'exp';
    // Budget total 8
    const {expenseLabel, budgetLabel, incomeLabel, expensePercentLabel, savingsPercentLabel, savingsLabel} = base.DOMstrings;
    document.querySelector(budgetLabel).textContent = formatNumber(obj.budgetTotal, type);

    document.querySelector(incomeLabel).textContent = formatNumber(obj.incomeTotal, 'inc');
    document.querySelector(savingsLabel).textContent = formatNumber(obj.savingsTotal, 'sav');
    document.querySelector(expenseLabel).textContent = formatNumber(obj.expenseTotal, 'exp');


    // TODO Percentage
    // if (obj.percentageExpense > 0 || obj.percentageSavings > 0) {
    //     document.querySelector(expensePercentLabel).textContent = obj.percentageExpense+'%';
    //     document.querySelector(savingsPercentLabel).textContent = obj.percentageSavings+'%';
    // }  else {
    //     document.querySelector(expensePercentLabel).textContent = '---';
    //     document.querySelector(savingsPercentLabel).textContent = '---';
    // }

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



