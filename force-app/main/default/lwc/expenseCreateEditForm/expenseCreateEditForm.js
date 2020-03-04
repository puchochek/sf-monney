import { LightningElement, api } from 'lwc';
import save from '@salesforce/apex/ExpenseController.save';

const DECIMAL_NUMBER_REGEXP = '^[0-9]+([,.][0-9]+)?$';
const MALFORMED_SUM_ERROR_MESSAGE = 'This field is required. Only positive numbers are allowed.';

export default class ExpenseCreateEditForm extends LightningElement {
    commentLbl = 'Comment';
    sumLbl = 'Sum';
    dateLbl = 'Date';
    commentPlaceholder = 'Leave a comment for the transaction';
    sumPlaceholder = 'Enter a sum';
    cancelBtn = 'Cancel';
    saveBtn = 'Save';
    malformedSumInputMessage;
    expenseDate;
    maxDate;
    category;
    isSumMalformed;

    @api
    get categoryToAddExpense() {
        return this._categoryToAddExpense;
    }
    set categoryToAddExpense(value) {
        this.setCategory(value);
    }

    constructor() {
        super();
        this.setDateInputDefaults();
    }

    setCategory(categoryToAddExpense) {
        this.category = categoryToAddExpense;
        console.log('---> add exp category ===', JSON.parse(JSON.stringify(this.category)));
    }

    setDateInputDefaults() {
        const today = new Date();
        this.expenseDate = today.toISOString().substr(0, 10);
        this.maxDate = this.expenseDate;
    }

    validateDecimalInput(event) {
        const sumInput = event.currentTarget.value;
        const isSumValid = this.validateSum(sumInput);

        if (!isSumValid) {
            this.isSumMalformed = true;
            this.malformedSumInputMessage = MALFORMED_SUM_ERROR_MESSAGE;
        } else {
            this.isSumMalformed = false;
        }
    }

    validateSum(sumInput) {
        const sumRegexp = new RegExp(DECIMAL_NUMBER_REGEXP, 'g');
        const validSumInput = sumInput.match(sumRegexp);

        return validSumInput ? true : false;
    }

    saveExpense() {
        const userInput = this.getUserInput();
        console.log('---> userInput', userInput);
        if (userInput) {
            save({ "expenseJSON": JSON.stringify(userInput) })
                .then(result => {
                    console.log('---> result', result);
                    return result;
                })
                .catch(error => {
                    this.error = error;
                });
        } else {
            //TODO toast notification
        }
    }


    getUserInput() {
        const sumInput = this.template.querySelector("[name='sum']");
        const commentInput = this.template.querySelector("[name='comment']");
        const dateInput = this.template.querySelector("[name='date']");

        const isSumValid = this.validateSum(sumInput.value);
        let expenseToHandle;
        if (isSumValid) {
            const userInput = {
                sum: sumInput.value,
                date: dateInput.value,
                comment: commentInput.value
            };
            expenseToHandle = this.buildExpenseToHandle(userInput);
        } else {
            this.isSumMalformed = true;
            this.malformedSumInputMessage = MALFORMED_SUM_ERROR_MESSAGE;
        }

        return expenseToHandle;
    }

    buildExpenseToHandle(userInput) {
        //TODO In case of Edit existed Expense will be passed
        const category = JSON.parse(JSON.stringify(this.category))

        const expenseToHandle = {
            id: null,
            category: category.id,
            transactionDate: userInput.date,
            sum: userInput.sum,
            comment: userInput.comment,
            isIncome: category.isIncome,
        }

        return expenseToHandle;
    }

    dispatchCloseAddExpenseFormEvent() {
        const closeAddExpenseForm = new CustomEvent("closeaddexpenseform");

        this.dispatchEvent(closeAddExpenseForm);
    }
}