import { LightningElement, api} from 'lwc';

export default class NoExpenseCategories extends LightningElement {
    monneyUserId;
    noCategoriesMessage = `You don't have an Expense categories yet.
    It would be great to add some to keep your expenses in order.`;
    addBtnLbl = 'Add';

    @api
    get currentAppUser() {
        return this._currentAppUser;
    }
    set currentAppUser(value) {
        this.setAppUser(value);
    }

    setAppUser(currentAppUser) {
        console.log('---> NoExpenseCategories ', currentAppUser);
        this.monneyUserId = currentAppUser.monneyUserId;
    }

    dispatchOpenCategoryFormEvent() {
        console.log('---> dispatchOpenCategoryFormEvent' );
        const addCategoryEvent = new CustomEvent("addcategory");

        this.dispatchEvent(addCategoryEvent);
    }
}