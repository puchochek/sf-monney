import { LightningElement, api } from 'lwc';

export default class NoExpenseCategories extends LightningElement {
    noCategoriesMessage = `You don't have an Expense categories yet.
    It would be great to add some to keep your expenses in order.`;
    addBtnLbl = 'Add';
    newCategoryDetail;

    @api
    get monneyUserId() {
        return this._monneyUserId;
    }
    set monneyUserId(value) {
        this.setNewCategoryDetail(value);
    }

    setNewCategoryDetail(monneyUserId) {
        this.newCategoryDetail = {
            monneyUserId: monneyUserId
        };
    }

    dispatchOpenCategoryFormEvent() {
        const addCategoryEvent = new CustomEvent("addcategory", {
            detail: this.newCategoryDetail
        });

        this.dispatchEvent(addCategoryEvent);
    }
}