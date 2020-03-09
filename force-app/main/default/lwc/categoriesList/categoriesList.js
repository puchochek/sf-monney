import { LightningElement, api } from 'lwc';

export default class CategoriesList extends LightningElement {
    addBtnLbl = 'Add category';
    categoriesList;

    @api
    get expensesCategories() {
        return this._expensesCategories;
    }
    set expensesCategories(value) {
        this.setCategoriesList(value);
    }

    setCategoriesList(expensesCategories) {
        this.categoriesList = expensesCategories;
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
}