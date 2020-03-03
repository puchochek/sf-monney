import { LightningElement, api } from 'lwc';

export default class CategoryCard extends LightningElement {
    categoryTitle;
    category;
    icon;
    expenses;
    viewAllBtnLbl = 'View all';
    addBtnLbl = 'All';
    lastTransactionLbl = 'Last: ';
    transactionsTotalLbl = 'Total: ';
    lastTransactionValue;
    transactionsTotalValue;

    @api
    get cardCategory() {
        return this._cardCategory;
    }
    set cardCategory(value) {
        this.setCategory(value);
    }

    setCategory(cardCategory) {
        this.category = cardCategory.category;
        this.icon = cardCategory.icon;
        this.expenses = cardCategory.category.expenses;
        console.log('---> this.category ', JSON.parse(JSON.stringify(this.category)));
        this.lastTransactionValue = this.expenses.length ? this.setLastTransactionValue() : 0;
        this.transactionsTotalValue = this.expenses.length ? this.setTransactionsTotalValue() : 0;
    }

    setLastTransactionValue() {

    }

    setTransactionsTotalValue() {

    }
}