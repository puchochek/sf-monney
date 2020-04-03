import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { ExpenseService } from 'c/expenseDMLService';
import labels from './expenseCreateEditFormLabels';
import constants from './expenseCreateEditFormConstants';


export default class ExpenseCreateEditForm extends LightningElement {
    labels = labels;

    malformedSumInputMessage;
    expenseDate;
    maxDate;
    category;
    expense;
    isSumMalformed;
    upsertedExpenses;

    @api
    get expenseCategory() {
        return this._expenseCategory;
    }
    set expenseCategory(value) {
        this.setCategoryDefaults(value);
    }

    @api
    get expenseToEdit() {
        return this._expenseToEdit;
    }
    set expenseToEdit(value) {
        this.setExpenseDefaults(value);
    }

    renderedCallback() {
        if (this.expense) {
            this.setFormInputDefaults();
        } else {
            this.setDateDefaults();
        }
    }

    setCategoryDefaults(categoryToAddExpense) {
        this.category = JSON.parse(JSON.stringify(categoryToAddExpense));
    }

    setExpenseDefaults(expenseToEdit) {
        this.expense = JSON.parse(JSON.stringify(expenseToEdit));
    }

    setDateDefaults() {
        const today = new Date();
        this.expenseDate = today.toISOString().substr(0, 10);
        this.maxDate = this.expenseDate;
    }

    setFormInputDefaults() {
        this.dateInput.value = this.expense.transactionDate;
        this.commentInput.value = this.expense.comment;
        this.sumInput.value = this.expense.sum;
    }

    validateDecimalInput(event) {
        const sumInput = event.currentTarget.value;
        const isSumValid = this.validateSum(sumInput);

        if (!isSumValid) {
            this.isSumMalformed = true;
            this.malformedSumInputMessage = constants.MALFORMED_SUM_ERROR_MESSAGE;
        } else {
            this.isSumMalformed = false;
        }
    }

    validateSum(sumInput) {
        const sumRegexp = new RegExp(constants.DECIMAL_NUMBER_REGEXP, 'g');
        const validSumInput = sumInput.match(sumRegexp);

        return validSumInput ? true : false;
    }

    handleSaveBtnClick() {
        const expenseToHandle = this.getExpenseToHandle();
        console.log('---> expenseToHandle*', expenseToHandle);
        if (expenseToHandle) {
            if (this.expenseToEdit) {
                ExpenseService.update(expenseToHandle)
                    .then(result => {
                        if (result) {
                            this.upsertedExpenses = JSON.parse(result);
                            this.handleSuccessResult();
                        } else {
                            this.handleErrorResult();
                        }
                    });
            } else {
                ExpenseService.save(expenseToHandle)
                    .then(result => {
                        if (result) {
                            this.upsertedExpenses = JSON.parse(result);
                            this.handleSuccessResult();
                        } else {
                            this.handleErrorResult();
                        }
                    });
            }
        } else {
            this.handleErrorResult(constants.TOAST_INPUT_ERROR_MESSAGE);
        }
    }

    getExpenseToHandle() {
        let expenseToHandle;
        if (this.isSumMalformed) {
            this.malformedSumInputMessage = constants.MALFORMED_SUM_ERROR_MESSAGE;
        } else {
            const formattedUserInput = this.getFormattedUserInput();
            expenseToHandle = this.buildExpenseToHandle(formattedUserInput);
        }

        return expenseToHandle;
    }

    getFormattedUserInput() {
        const userInput = {
            sum: this.formatSum(this.sumInput.value),
            date: this.dateInput.value,
            comment: this.commentInput.value
        };

        return userInput;
    }

    buildExpenseToHandle(userInput) {
        return {
            id: this.expenseToEdit ? this.expenseToEdit.id : null,
            category: this.category.id,
            transactionDate: userInput.date,
            sum: userInput.sum,
            comment: userInput.comment,
            isIncome: this.category.isIncome,
        }
    }

    formatSum(sumInput) {
        const commaIndex = sumInput.indexOf(',');

        return commaIndex === -1 ? sumInput : sumInput.replace(',', '.');
    }

    handleSuccessResult() {
        this.showToast(constants.TOAST_SUCCESS_MESSAGE, constants.TOAST_SUCCESS_VARIANT);
        this.dispatchCloseAddExpenseFormEvent();
    }

    handleErrorResult(toastError = constants.TOAST_SAVE_ERROR_MESSAGE) {
        this.showToast(toastError, constants.TOAST_ERROR_VARIANT);
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

    get sumInput() {
        return this.template.querySelector("[name='sum']");
    }

    get commentInput() {
        return this.template.querySelector("[name='comment']")
    }

    get dateInput() {
        return this.template.querySelector("[name='date']");
    }
}