import { LightningElement, api } from 'lwc';

export default class CategoriesList extends LightningElement {
    addBtnLbl = 'Add category';
    categoriesHeaderLbl = 'Categories';
    categoriesList;

    @api
    get expensesCategories() {
        return this._expensesCategories;
    }
    set expensesCategories(value) {
        this.setCategoriesList(value);
    }

    setCategoriesList(expensesCategories) {
        this.categoriesList = JSON.parse(JSON.stringify(expensesCategories));
    }

    dispatchOpenCategoryFormEvent() {
        const categoryToUpsert = {
            monneyUserId: this.categoriesList[0].monneyUserId
        }; //temp

        const addCategoryEvent = new CustomEvent("addcategory", {
            detail: categoryToUpsert
        });

        this.dispatchEvent(addCategoryEvent);
    }

    passOpenExpenseFormEventToParent(event) {
        const categoryToAddExpense = JSON.parse(JSON.stringify(event.detail));
        this.dispatchOpenExpenseFormEvent(categoryToAddExpense);
    }

    passViewCategoryExpensesEventToParent(event) {
        const categoryToViewDetails = JSON.parse(JSON.stringify(event.detail));
        this.dispatchViewCategoryExpensesEvent(categoryToViewDetails);
    }

    dispatchOpenExpenseFormEvent(categoryToAddExpense) {
        const addExenseEvent = new CustomEvent("addexpense", {
            detail: categoryToAddExpense
        });

        this.dispatchEvent(addExenseEvent);
    }

    dispatchViewCategoryExpensesEvent(categoryToViewDetails) {
        const viewExpensesDetailsEvent = new CustomEvent("viewall", {
            detail: categoryToViewDetails
        });

        this.dispatchEvent(viewExpensesDetailsEvent);
    }
}