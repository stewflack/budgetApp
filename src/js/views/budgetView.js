import {DOMstrings} from "../base";
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

export const getInput = () => {
  return {
      type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
  };
};

export const addListItem = (obj, type) => {
    let markup, element;
    // create a HTML string with placeholder text
    if(type === 'inc') {
        element = DOMstrings.incomeContainer;
        markup = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div>\n<div class="right clearfix">
            <div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        markup = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix">
            <div class="item__value">${obj.value}</div><div class="expenses__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'sav') {
        element = DOMstrings.savingsContainer;
        markup = `<div class="item clearfix" id="sav-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix">
            <div class="item__value">${obj.value}</div><div class="savings__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    }
    // Insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', markup);
};

export const deleteListItem = selectorID => {
    const el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
};

export const clearFields = () => {
    var fields, fieldsArray;
    fields = document.querySelectorAll(DOMstrings.inputValue +','+ DOMstrings.inputDescription);
    // the above returns a list

    fieldsArray = Array.prototype.slice.call(fields);
    //pass in a callback funtion and then is applied to each item in the array
    fieldsArray.forEach((currentValue) => {

        currentValue.value = '';

    });
    fieldsArray[0].focus();
};

export const displayBudget = obj => {

    let type;
    obj.budget > 0 ? type = 'inc' : type = 'exp';
    // Budget total label
    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);

    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
    document.querySelector(DOMstrings.savingsLabel).textContent = formatNumber(obj.totalSavings, 'sav');
    document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');

    if (obj.percentageExpense > 0 || obj.percentageSavings > 0) {
        document.querySelector(DOMstrings.expensePercentLabel).textContent = obj.percentageExpense+'%';
        document.querySelector(DOMstrings.savingsPercentLabel).textContent = obj.percentageSavings+'%';
    }  else {
        document.querySelector(DOMstrings.expensePercentLabel).textContent = '---';
        document.querySelector(DOMstrings.savingsPercentLabel).textContent = '---';
    }

};

export const displayPercentage = percentages => {
    let fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
    each(fields, percentages);
};
export const displaySavingsPercent = percentages => {
    let fields = document.querySelectorAll(DOMstrings.savingsPercentageLabel);
    each(fields, percentages);
};

export const displayMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December'];
    const month = now.getMonth();
    // return month + ' ' + year;
    document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
};

export const changeType = () => {
    const type = DOMstrings.inputType;
    const fields = document.querySelectorAll(
        type + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);
    // fields.forEach(curr => curr.classList.toggle('red-focus'));
    console.log(type);
    fields.forEach(curr => {

        if (curr.value === 'exp') {
            fields.forEach(curr => curr.classList.remove('blue-focus'));
            fields.forEach(curr => curr.classList.add('red-focus'));
            document.querySelector(DOMstrings.inputBtn).classList.add('red');
        } else if (curr.value === 'sav') {
            fields.forEach(curr => curr.classList.remove('red-focus'));
            fields.forEach(curr => curr.classList.add('blue-focus'));
            document.querySelector(DOMstrings.inputBtn).classList.add('blue');
        } else if (curr.value === 'inc') {
            fields.forEach(curr => curr.classList.remove('red-focus'));
            fields.forEach(curr => curr.classList.remove('blue-focus'));
            document.querySelector(DOMstrings.inputBtn).classList.remove('blue');
            document.querySelector(DOMstrings.inputBtn).classList.remove('red');
        }
    });
};

export const focusFields = () => {
    const fields = document.querySelectorAll(DOMstrings.inputValue +','+ DOMstrings.inputDescription);
    // the above returns a list
    // TODO what was the ES6 way of doing this
    const fieldsArray = Array.prototype.slice.call(fields);
    /* Focus on Desc field */
    fieldsArray[0].focus();
};

export const updateInputs = (desc, value) => {
    document.querySelector(DOMstrings.inputValue).value = value.toString();
    document.querySelector(DOMstrings.inputDescription).value = desc;
};
/*
TODO - this will need to be improved but a good way for now while the items are not changing
 */
export const updateItem = (type, id, d, v) => {
    const combinedID = document.getElementById(`${type}-${id}`);
    const desc = combinedID.childNodes[0];
    const value = combinedID.childNodes[2].childNodes[1]
    desc.textContent = d;
    value.textContent = v;
};
/***
 * Toggle button to be complete edit and add new item
 */
console.log(DOMstrings.inputBtn);

export const toggleBtn = () => {
    // DOMstrings.inputBtn.classList.toggle('.btnDisplay');
    const add = document.getElementById('add_btn');
    const edit = document.getElementById('edit_btn');
    if (add.classList.contains('btnDisplay')) {
        add.classList.remove('btnDisplay');
        edit.classList.add('btnDisplay');
    } else if (edit.classList.contains('btnDisplay')) {
        edit.classList.remove('btnDisplay');
        add.classList.add('btnDisplay');
    }
};


