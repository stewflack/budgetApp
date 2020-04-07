import {DOMstrings} from "./base";
import Budget from './models/Budget';
import * as budgetView from './views/budgetView';
import {changeType} from "./views/budgetView";
import {getInput} from "./views/budgetView";


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

            // call and calculate budget
            updateBudget();

            // update percentages
            updatePercentages();
        } else {
            // Error Handling
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
            // 3. Update and show the new budget
            updateBudget();

            updatePercentages();
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

            const data = state.budget.getItem(id, type); //returns object
            // Update Input
            budgetView.clearFields();
            budgetView.focusFields();
            budgetView.updateInputs(data[id].description, data[id].value);
            budgetView.toggleBtn();
        }
    };
    const submitEditItem = () => {
        let idStorage = localStorage.getItem('itemId');
        const id = parseInt(idStorage);
        const type = localStorage.getItem('type');

        const newData = {
            description: getInput().description,
            value: getInput().value
        };
        state.budget.editItem(type, id, newData);
        localStorage.removeItem('itemId');
        localStorage.removeItem('type');

        budgetView.updateItem(type, idStorage, newData.description, newData.value);
        budgetView.clearFields();
        budgetView.toggleBtn();

        updateBudget();

        updatePercentages();
    };

    const setupEventListeners = () =>{
        const DOM = DOMstrings;

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        /***
         * TODO: Edit is not working off a click at the moment
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

         // document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        // document.querySelector(DOM.container).addEventListener('click', ctrlEditItem);
        document.querySelector(DOM.container).addEventListener('click', e => {
            console.log(e.target.parentNode.className);
            if(e.target.parentNode.className === DOMstrings.deleteItemBtn.replace('.', '')) {
                ctrlDeleteItem();
            } else if (e.target.parentNode.className === DOMstrings.editItemBtn.replace('.', '')) {
                ctrlEditItem();
            }
        });
        document.getElementById('edit_btn').addEventListener('click', submitEditItem);
        document.querySelector(DOM.inputType).addEventListener('change', changeType)
    };

    return {
        init: () => {
            console.log('The application has started');
            budgetView.displayMonth();
            budgetView.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                totalSavings: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
};

budgetController().init();



