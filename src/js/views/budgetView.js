import {DOMstrings} from "../base";

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
/*** TODO: Convert to foreach ***/
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
            <div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div></div></div>`;
    } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        markup = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix">
            <div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">
            <i class="ion-ios-close-outline"></i></button></div></div></div>`;
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
    fieldsArray.forEach(function (currentValue, index, array) {

        currentValue.value = '';

    });
    fieldsArray[0].focus();
};

export const displayBudget = obj => {

    var type;
    obj.budget > 0 ? type = 'inc' : type = 'exp';

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
    document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');
    if (obj.percentage > 0) {
        document.querySelector(DOMstrings.expensePercentLabel).textContent = obj.percentage+'%';
    }  else {
        document.querySelector(DOMstrings.expensePercentLabel).textContent = '---';
    }

};

export const displayPercentage = percentages => {

    var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

    nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
        } else {
            current.textContent = '---';
        }

    });

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
    const fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

    nodeListForEach(fields, function (current) {
        current.classList.toggle('red-focus');
    });
    document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
};
