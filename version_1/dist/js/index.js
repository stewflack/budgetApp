// import {DOMstrings, convertBudgetType} from "./base";
const base = require('./base')
// import Budget from '../../src/js/models/Budget';
const Budget = require('../../src/js/models/Budget')
// import * as budgetView from '../../src/js/views/budgetView';
const budgetView = require('./views/budgetView')

const notification = require('./views/Notifications')
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
        updateBudgetItems();
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



