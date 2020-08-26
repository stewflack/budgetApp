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
    closeEditModal: '.modal-close',
    editTypeInput: 'editType',
    editDescInput: 'editDesc',
    editValueInput: 'editValue'
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