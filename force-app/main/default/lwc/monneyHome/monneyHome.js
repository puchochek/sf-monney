import { LightningElement, api, wire, track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import monney from '@salesforce/resourceUrl/monney';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import getMonneyUser from '@salesforce/apex/MonneyHomeController.getCurrentMonneyUser';

export default class MonneyHome extends LightningElement {
    currentAppUser;
    monneyHomeTitle = 'Monney';
    income;
    isDataLoaded = false;
    isError;
    isExpenseCreateEditFormOpen;
    isCategoryCreateEditFormOpen;
    expenseCardsCategories;
    noExpenseCategories;
    categoryToUpsert;
    monneyUserId;

    @api categoryToAddExpense;

    constructor() {
        super();
        if (USER_ID) {
            this.getExistedMonneyUser();
        }
    }

    connectedCallback() {
        loadStyle(this, monney + '/monney/styles.css');
    }

    getExistedMonneyUser() {
        return getMonneyUser({ "userId": USER_ID })
            .then(result => {
                this.setAppInitialData(result);
                return result;
            })
            .catch(error => {
                this.isError = true;
            });
    }

    setAppInitialData(currentUser) {
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
        const upsertedExpenses = JSON.parse(JSON.stringify(event.detail));

        if (upsertedExpenses) {
            this.getExistedMonneyUser();
        }
    }

    openCategoryForm(event) {
        this.isCategoryCreateEditFormOpen = true;
        this.categoryToUpsert = JSON.parse(JSON.stringify(event.detail));
    }

    closeCategoryForm(event) {
        this.isCategoryCreateEditFormOpen = false;
        const upsertedCategories = JSON.parse(JSON.stringify(event.detail));

        if (upsertedCategories) {
            this.getExistedMonneyUser();
        }
    }
}