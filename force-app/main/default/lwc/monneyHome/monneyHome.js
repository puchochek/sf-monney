import { LightningElement, api, wire, track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import monney from '@salesforce/resourceUrl/monney';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import getMonneyUser from '@salesforce/apex/MonneyHomeController.getCurrentMonneyUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const TOAST_ERROR_VARIANT = 'error';
const HOME_ERROR_MESSAGE = 'Opps! Someting is wrong. Please, try again!';

export default class MonneyHome extends LightningElement {
    currentAppUser;
    monneyHomeTitle = 'Monney';
    income;
    isDataLoaded = false;
    isError;
    isNewExpenseRequired;
    upsertedExpenses;

    @api categoryToAddExpense;

    constructor() {
        super();
        if (USER_ID) {
            this.getExistedMonneyUser()
                .then(result => {
                    if (result) {
                        this.setHomeInitialData(result);
                    } else {
                        this.isError = true;
                    }
                })
        }
    }

    connectedCallback() {
        loadStyle(this, monney + '/monney/styles.css');
    }

    getExistedMonneyUser() {
        return getMonneyUser({ "userId": USER_ID })
            .then(result => {

                return result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    setHomeInitialData(currentUser) {
        this.currentAppUser = JSON.parse(currentUser);
        console.log('---> this.currentAppUser', this.currentAppUser);
        this.isDataLoaded = true;
        this.setIncomeCategory();
    }

    setIncomeCategory() {
        this.income = this.currentAppUser.categoriesWithExpenses.find(category => category.isIncome);
    }

    openAddExpenseForm(event) {
        this.categoryToAddExpense = JSON.parse(JSON.stringify(event.detail));
        this.isNewExpenseRequired = true;
    }

    closeAddExpenseForm(event) {
        this.isNewExpenseRequired = false;
        this.upsertedExpenses = JSON.parse(JSON.stringify(event.detail));

        if (this.upsertedExpenses) {
            this.updateCurrentAppUserExpenses();
        }
    }

    updateCurrentAppUserExpenses() {
        this.currentAppUser.categoriesWithExpenses.forEach(category => {
            const upsertedExpensesForTheCategory = this.upsertedExpenses.filter(expense => expense.category === category.id);
            const existedCategoryExpenses = category.expenses;
            this.updateExpensesForCurrentCategory(upsertedExpensesForTheCategory, existedCategoryExpenses)
        });
    }

    updateExpensesForCurrentCategory(upsertedExpensesForTheCategory, existedCategoryExpenses) {
        upsertedExpensesForTheCategory.forEach(upsertedExpense => {
            const existedExpense = existedCategoryExpenses.find(expense => expense.id === upsertedExpense.id);

            if (existedExpense) {
                existedExpense = upsertedExpense;
            } else {
                existedCategoryExpenses.push(upsertedExpense);
            }
        });
    }

    //TODO change to success notification toast
    showErrorMessage(toastMessage, toastVariant = TOAST_ERROR_VARIANT) {
        const toastEvent = new ShowToastEvent({
            message: toastMessage,
            variant: toastVariant,
        });
        this.dispatchEvent(toastEvent);
    }
}