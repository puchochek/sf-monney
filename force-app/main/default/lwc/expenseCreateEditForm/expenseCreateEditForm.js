import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import save from '@salesforce/apex/ExpenseController.save';

const TOAST_ERROR_VARIANT = 'error';
const TOAST_SUCCESS_VARIANT = 'success';
const TOAST_SAVE_ERROR_MESSAGE = 'Opps! Someting is wrong. Please, try again!';
const TOAST_INPUT_ERROR_MESSAGE = 'Please check the input!';
const TOAST_SUCCESS_MESSAGE = 'The record was saved.';
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
    upsertedExpenses;

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
        const expenseToHandle = this.getExpenseToHandle();
        console.log('---> expenseToHandle', expenseToHandle);
        if (expenseToHandle) {
            save({ "expenseJSON": JSON.stringify(expenseToHandle) })
                .then(result => {
                    if (result) {
                        this.upsertedExpenses = JSON.parse(result);
                        this.handleSuccessResult();
                    } else {
                        this.handleErrorResult();
                    }
                });
        } else {
            this.handleErrorResult(TOAST_INPUT_ERROR_MESSAGE);
        }
    }

    getExpenseToHandle() {
        let expenseToHandle;
        if (this.isSumMalformed) {
            this.malformedSumInputMessage = MALFORMED_SUM_ERROR_MESSAGE;
        } else {
            const formattedUserInput = this.getFormattedUserInput();
            expenseToHandle = this.buildExpenseToHandle(formattedUserInput);
        }

        return expenseToHandle;
    }

    getFormattedUserInput() {
        const sumInput = this.template.querySelector("[name='sum']");
        const commentInput = this.template.querySelector("[name='comment']");
        const dateInput = this.template.querySelector("[name='date']");

        const userInput = {
            sum: this.formatSum(sumInput.value),
            date: dateInput.value,
            comment: commentInput.value
        };

        return userInput;
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

    formatSum(sumInput) {
        const commaIndex = sumInput.indexOf(',');

        return commaIndex === -1 ? sumInput : sumInput.replace(',', '.');
    }

    handleSuccessResult() {
        this.showToast(TOAST_SUCCESS_MESSAGE, TOAST_SUCCESS_VARIANT);
        this.dispatchCloseAddExpenseFormEvent();
    }

    handleErrorResult(toastError = TOAST_SAVE_ERROR_MESSAGE) {
        this.showToast(toastError, TOAST_ERROR_VARIANT);
    }

    showToast(toastMessage, toastVariant) {
        const toastEvent = new ShowToastEvent({
            message: toastMessage,
            variant: toastVariant,
        });
        this.dispatchEvent(toastEvent);
    }

    dispatchCloseAddExpenseFormEvent() {
        const closeAddExpenseForm = new CustomEvent("closeexpenseform", {
            detail: this.upsertedExpenses
        });

        this.dispatchEvent(closeAddExpenseForm);
    }
}