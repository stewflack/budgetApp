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

fetch('/budget').then((response) => {
    const res = response.json()
    res.then(data => {
        if (data.error) {

        } else {
            const test = document.querySelector('.testOutput')

            data.forEach((el, i) => {
                let markup, element;
                // create a HTML string with placeholder text
                if(el.budget_type === 'inc') {
                    element = DOMstrings.incomeContainer;
                    markup = `<div class="item clearfix" id="inc-${el.budget_id}"><div class="item__description">${el.budget_description}</div>\n<div class="right clearfix" style="width: 80px; position: relative;">
                    <div class="item__value">${el.budget_value}</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
                    </div></div></div>`;
                        } else if (el.budget_type === 'exp') {
                            element = DOMstrings.expenseContainer;
                            markup = `<div class="item clearfix" id="exp-${el.budget_id}"><div class="item__description">${el.budget_description}</div><div class="right clearfix" style="width: 80px; position: relative;">
                    <div class="item__value">${el.budget_value}</div><div class="expenses__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
                    </div></div></div>`;
                        } else if (el.budget_type === 'sav') {
                            element = DOMstrings.savingsContainer;
                            markup = `<div class="item clearfix" id="sav-${el.budget_id}"><div class="item__description">${el.budget_description}</div><div class="right clearfix" style="width: 80px; position: relative;">
                    <div class="item__value">${el.budget_value}</div><div class="savings__item__percentage">21%</div><div class="item__delete"><button class="item__edit--btn"><i class="far fa-edit"></i></button><button class="item__delete--btn"><i class="far fa-trash-alt"></i></button>
                    </div></div></div>`;
                }
                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', markup);
            })
            console.log(data[4])

        }
    })


}).catch(e => console.log(e))

fetch('/budget/totals').then(response => {
    const res = response.json()
    res.then(data => {
        DOMstrings.budgetLabel.textContent = data.budgetTotal
    })
})