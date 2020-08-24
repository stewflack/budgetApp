(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const base = require('./base')
const endpoint = require('./endPointCalls')
const budgetView = require('./views/budgetView')

/**** BUDGET CONTROLLER *****/
const budgetController = () => {

    const updateBudgetItems = () => {
        endpoint.getBudgets().then(res => {
            // console.log(res)
            res.forEach((el) => {
                budgetView.addListItem(el, el.budget_type)
            })
        })
    }

    const updateBudgetSummary = async () => {
        try {
            const summary = await endpoint.getBudgetSummary()
            budgetView.displayBudget(summary)
        }catch (e) {
            console.error(e)
        }
    }

    const addItem = async () => {
        let input, newItem;
        // 1. Get the field input dat
        input = budgetView.getInput();
        if(input.description !== '' && input.value !== '' && input.value > 0 && !isNaN(input.value)) {
            // 2 Add the item to the budget controller
            newItem = {
                budget_type:input.type,
                budget_description: input.description,
                budget_value: input.value
            }
            try {
                const data = await endpoint.postData('/budget','POST', newItem)
                const response = await data.json();
                console.log(response)
                budgetView.addListItem(data, input.type);
            }catch (e) {
                console.error(e)
            }
            // 4 Clear the fields
            budgetView.clearFields();

            let type = base.convertBudgetType(input.type);
            let prefix = input.type !== 'sav' ? 'An' : 'A';
            // notification.createNotification('success', `${prefix} <strong>${type}</strong> has been created`, '');
            // Update Overalls
            await updateBudgetSummary()
        } else {
            // Error Handling
            // notification.createNotification('alert', 'Please fill in the required input fields', '', 3000);

            budgetView.focusFields()
        }
    }

    /** Delete Item **/
    const ctrlDeleteItem = async () => {
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

            // 1. Delete item from data structure endpoint
            try {
                await endpoint.deleteData('/budget', id)
                // 2. delete item from UI
                budgetView.deleteListItem(itemID);
                // 3. Update and show the new budget
                await updateBudgetSummary()

            } catch (e) {
                console.log(e)
            }
            // updatePercentages(); // what is this part
            // Update Local Storage
            // state.budget.storeLocalStorage();
        } else {
            console.log('Item ID not found')
        }
    };

    let itemID
        // Show edit item
    const ctrlEditItem = () => {
        let splitID, type, id;
        /*
         Not the best way to complete as we have hardcoded the HTML to be this way, If we add in something else
         then the chain will change
         */
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        const item = document.getElementById(itemID);
        const desc = item.children[0].textContent;
        const value = item.children[1].children[0].textContent
        // if the element has an ID then do something
        if (itemID) {
            // returns an array
            splitID = itemID.split('-'); // split the string and store in an array
            type = splitID[0]; // inc/exp/sav
            id = parseInt(splitID[1]); // number

            // Show Edit model
            let editModal = document.querySelector('.edit_center')
            editModal.style.display = 'block'
            // Update Input and focus edit
            document.getElementById('editType').value = type
            document.getElementById('editDesc').value = desc
            document.getElementById('editValue').value = value
            document.getElementById('editDesc').focus();
        }
    }

    const crtlSubmitEdit = async () => {
        console.log('submit')
        // Get data from edit fields
        //TODO put these into the DOMStrings
        const updateData = {
            budget_type: document.getElementById('editType').value,
            budget_description: document.getElementById('editDesc').value,
            budget_value: document.getElementById('editValue').value
        }
        let splitID = itemID.split('-'); // split the string and store in an array
        let type = splitID[0]; // inc/exp/sav
        let id = splitID[1]

        // Submit to edit endpoint
        try {
            const data = await endpoint.postData(`/budget/${id}`,'PATCH', updateData)
            console.log(data)
            budgetView.updateItem(type, updateData.budget_type, id, data[0].budget_description, data[0].budget_value, data[0].percent)
            // Show Edit model
            let editModal = document.querySelector('.edit_center')
            editModal.style.display = 'none'

            // 3. Update and show the new budget
            await updateBudgetSummary()
        } catch (e) {
            console.log(e)
        }
    }



    const setupEventListeners = () =>{
        const DOM = base.DOMstrings;
        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
        /***
         * TODO: Edit is not working off a enter at the moment
         */
        document.addEventListener('keypress',  async event => {
            if(event.keyCode === 13 || event.which === 13) {
                const add = document.getElementById('add_btn');
                /* Check which button is shown to the user */
                if (add.classList.contains('btnDisplay')) {
                    await addItem();
                }
            }
        });

        document.querySelector(DOM.container).addEventListener('click', async e => {
            console.log(e.target.parentNode.className);
            if(e.target.parentNode.className === DOM.deleteItemBtn.replace('.', '')) {
                await ctrlDeleteItem();
            } else if (e.target.parentNode.className === DOM.editItemBtn.replace('.', '')) {
                ctrlEditItem();
            }
        });
        document.getElementById('edit_btn').addEventListener('click', crtlSubmitEdit);
        document.querySelector(DOM.inputType).addEventListener('change', budgetView.changeType)
   
        document.querySelector(DOM.closeEditModal).addEventListener('click', budgetView.closeEditModal);
    };

    return {
        init: async () =>{
            console.log('Application has started on the client')
            setupEventListeners();
            // Display Months
            budgetView.displayMonth()
            // Update Overalls
            await updateBudgetSummary()
            // Update Budget Items
            updateBudgetItems()

        }
    }
}


budgetController().init().then(r => console.log('Front end running'))

},{"./base":2,"./endPointCalls":3,"./views/budgetView":4}],2:[function(require,module,exports){
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
    dateLabel: '.budget__title--month',
    closeEditModal: '.modal-close'
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
},{}],3:[function(require,module,exports){
const getBudgets = async () => {
    const myRequest = new Request('/budget', {
        method: 'GET'
    });

    try {
        const resp = await fetch(myRequest)

        let data = resp.json()
        console.log(data)
        return data
    } catch (err) {
        console.log(err)
    }
}

const getBudgetSummary = async () => {
    const myRequest = new Request('/budget/totals', {
        method: 'GET'
    });
    try {
        const resp = await fetch(myRequest)
        console.log('Getting totals')
        return resp.json()
    } catch (e) {
        console.log(e)
    }
}

// Example POST method implementation:
async function postData(url = '',type, data) {
    // console.log(data)
    // Default options are marked with *
    try {
        const response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(data)
        });
        return response; // parses JSON response into native JavaScript objects
    } catch (e) {
        console.error(e)
    }
}

const deleteData = async (url, id) => {
    try {

        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()

    } catch (e) {
        console.error(e)
    }
}



/***
 * Calculate the Percentages
 * Implement the EventListeners for editing, adding, deleting and reading data
 * Small UI changes including
 *          : Focus Fields
 *          : Colour CHanges
 *          ECT
 *
 * After this It SHOULD be at the same stage as before, next to implement user Authentication
 */


module.exports = {
    getBudgets,
    getBudgetSummary,
    postData,
    deleteData

}
},{}],4:[function(require,module,exports){
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
const clearBudgetView = () => {
    base.DOMstrings.incomeContainer.innerHTML = ''
    base.DOMstrings.expenseContainer.innerHTML = ''
    base.DOMstrings.savingsContainer.innerHTML = ''
}
const addListItem = (obj, type) => {
    let markup, element;
    // create a HTML string with placeholder text
    base.DOMstrings.incomeContainer.innerHTML = ''
    base.DOMstrings.expenseContainer.innerHTML = ''
    base.DOMstrings.savingsContainer.innerHTML = ''
    let percent = obj.percent === null ? '---' : obj.percent+'%'
    if(type === 'inc') {
        element = base.DOMstrings.incomeContainer;
        markup = `<div class="item clearfix" id="inc-${obj.budget_id}"><div class="item__description">${obj.budget_description}</div>\n<div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.budget_value}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'exp') {
        element = base.DOMstrings.expenseContainer;
        markup = `<div class="item clearfix" id="exp-${obj.budget_id}"><div class="item__description">${obj.budget_description}</div><div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.budget_value}</div><div class="expenses__item__percentage">${percent}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
            </div></div></div>`;
    } else if (type === 'sav') {
        element = base.DOMstrings.savingsContainer;
        markup = `<div class="item clearfix" id="sav-${obj.budget_id}"><div class="item__description">${obj.budget_description}</div><div class="right clearfix" style="width: 80px; position: relative;">
            <div class="item__value">${obj.budget_value}</div><div class="savings__item__percentage">${percent}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
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

    if (obj.percentages.exp > 0 || obj.percentages.sav > 0) {
        document.querySelector(expensePercentLabel).textContent = obj.percentages.exp+'%';
        document.querySelector(savingsPercentLabel).textContent = obj.percentages.sav+'%';
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

/**CHANGING BORDER COLOURS **/
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
const updateItem = (type, newType,id, d, v, p = null) => {
    const combinedID = document.getElementById(`${type}-${id}`);
    // Remove old item
    combinedID.parentNode.removeChild(combinedID)
    // Create object usable for addListItem()
    const obj = {
        budget_id: id,
        budget_description: d,
        budget_value: v,
        percent: p
    }
    // Add
    console.log(obj, newType)
    addListItem(obj, newType)

    // const desc = combinedID.childNodes[0];
    // let value, percent;
    // if (type === 'inc') {
    //     value = combinedID.children[1].children[0];
    // } else {
    //     value = combinedID.children[1].children[0];
    //     percent = combinedID.children[1].children[1]
    //     percent.textContent = p + '%'
    // }
    // desc.textContent = d;
    // value.textContent = v;

};

const closeEditModal = () => {
    let editModal = document.querySelector('.edit_center');
    editModal.style.display = 'none';
    // Update Input and focus edit
    document.getElementById('editType').value = '';
    document.getElementById('editDesc').value = '';
    document.getElementById('editValue').value = '';
}

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
    clearBudgetView,
    closeEditModal
}




},{"../base":2}]},{},[1]);
