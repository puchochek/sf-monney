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
    isExpenseCreateEditFormOpen;
    isCategoryCreateEditFormOpen;
    upsertedExpenses;
    expenseCardsCategories;
    noExpenseCategories;
    categoryToUpsert;
    monneyUserId;

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
        console.log('---> currentAppUser', this.currentAppUser);
        this.isDataLoaded = true;
        this.monneyUserId = this.currentAppUser.id;

        this.setIncomeCategory();
        this.setExpensesCategories();
    }

    setIncomeCategory() {
        this.income = this.currentAppUser.categoriesWithExpenses.find(category => category.isIncome);
    }

    setExpensesCategories() {
        const expenseCategories = this.currentAppUser.categoriesWithExpenses.filter(category => !category.isIncome);

        if (expenseCategories.length) {
            this.expenseCardsCategories = expenseCategories;
        } else {
            this.noExpenseCategories = true;
        }
    }

    openExpenseForm(event) {
        this.categoryToAddExpense = JSON.parse(JSON.stringify(event.detail));
        this.isExpenseCreateEditFormOpen = true;
    }

    closeExpenseForm(event) {
        this.isExpenseCreateEditFormOpen = false;
        this.upsertedExpenses = JSON.parse(JSON.stringify(event.detail));

        if (this.upsertedExpenses) {
            this.updateCurrentAppUserExpenses();
        }
    }

    openCategoryForm(event) {
        this.isCategoryCreateEditFormOpen = true;
        this.categoryToUpsert = JSON.parse(JSON.stringify(event.detail));
    }

    closeCategoryForm() {
        this.isCategoryCreateEditFormOpen = false;
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