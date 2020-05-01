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

    const updateBudgetSummary = () => {
        endpoint.getBudgetSummary().then(res => {
            budgetView.displayBudget(res)
            console.log(res)
        })
    }

    const addItem = () => {
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
            endpoint.postData('/budget', newItem).then(data => {
                    console.log(data); // JSON data parsed by `response.json()` call
            }).catch(e => {
                console.error(e)
            });
            // 3 add the item to the user interface
            budgetView.addListItem(newItem, input.type);
            // 4 Clear the fields
            budgetView.clearFields();

            let type = base.convertBudgetType(input.type);
            let prefix = input.type !== 'sav' ? 'An' : 'A';
            // notification.createNotification('success', `${prefix} <strong>${type}</strong> has been created`, '');

            // Update Budget Items
            updateBudgetItems()

            // Update Overalls
            updateBudgetSummary()
        } else {
            // Error Handling
            // notification.createNotification('alert', 'Please fill in the required input fields', '', 3000);
            budgetView.focusFields()
        }
    }



    const setupEventListeners = () =>{
        const DOM = base.DOMstrings;

        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);

        /***
         * TODO: Edit is not working off a enter at the moment
         */
        document.addEventListener('keypress',  event => {
            if(event.keyCode === 13 || event.which === 13) {
                const add = document.getElementById('add_btn');
                const edit = document.getElementById('edit_btn');
                /* Check which button is shown to the user */
                if (add.classList.contains('btnDisplay')) {
                    addItem();
                } else if (edit.classList.contains('btnDisplay')) {
                    // ctrlEditItem();
                }
            }
        });

        document.querySelector(DOM.container).addEventListener('click', e => {
            console.log(e.target.parentNode.className);
            if(e.target.parentNode.className === DOM.deleteItemBtn.replace('.', '')) {
                // ctrlDeleteItem();
            } else if (e.target.parentNode.className === DOM.editItemBtn.replace('.', '')) {
                // ctrlEditItem();
            }
        });
        // document.getElementById('edit_btn').addEventListener('click', submitEditItem);
        document.querySelector(DOM.inputType).addEventListener('change', budgetView.changeType)
    };

    return {
        init: () =>{
            console.log('Application has started on the client')
            setupEventListeners();
            // Display Months
            budgetView.displayMonth()

            // Update Budget Items
            updateBudgetItems()

            // Update Overalls
            updateBudgetSummary()
        }
    }
}



budgetController().init()
