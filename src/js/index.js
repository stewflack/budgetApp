import {DOMstrings} from "./base";
import Budget from './models/Budget';
import * as budgetView from './views/budgetView';
import {changeType} from "./views/budgetView";



const state = {};
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
        const percentages = state.budget.getPercentages();
        // Update the UI
        budgetView.displayPercentage(percentages);
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

    const setupEventListeners = () =>{
        const DOM = DOMstrings;

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

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
                percentage: -1
            });
            setupEventListeners();
        }
    }
};

budgetController().init();



