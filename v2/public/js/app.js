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
                console.log(data)
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
