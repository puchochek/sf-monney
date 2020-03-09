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
        console.log('---> this.categoriesList', this.categoriesList);
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