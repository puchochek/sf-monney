import { LightningElement, api } from 'lwc';

export default class CategoryCard extends LightningElement {
    incomesTitle = 'Incomes';
    @api category;
    categoryTitle;

    constructor() {
        super();
        // this.categoryTitle = category.name;

    }
}