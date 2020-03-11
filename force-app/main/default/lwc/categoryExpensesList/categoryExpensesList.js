import { LightningElement, api } from 'lwc';

export default class CategoryExpensesList extends LightningElement {
    category;
    expenses;
    rowOffset = 5;
    cancelBtn = 'Cancel';
    @api
    get categoryToViewDetails() {
        return this._categoryToViewDetails;
    }
    set categoryToViewDetails(value) {
        this.setCategory(value);
    }

    columns = [
        {
            label: 'Date',
            fieldName: 'transactionDate'
        },
        {
            label: 'Sum',
            fieldName: 'sum',
            type: 'number'
        },
        {
            label: 'Comment',
            fieldName: 'comment'
        },
        {
            type: 'button-icon',
            initialWidth: 75,
            typeAttributes: {
                iconName: 'utility:edit',
                title: 'Edit',
                variant: 'border-filled',
                alternativeText: 'edit'
            }
        },
        {
            type: 'button-icon',
            initialWidth: 75,
            typeAttributes: {
                iconName: 'utility:delete',
                title: 'Delete',
                variant: 'border-filled',
                alternativeText: 'delete'
            }
        },
    ];

    setCategory(category) {
        this.category = JSON.parse(JSON.stringify(category));
        console.log('---> LIST this.category', this.category);
        this.expenses = this.category.expenses;
        console.log('---> this.expenses', this.expenses);
    }

    handleRowAction(event) {
        console.log('---> handleRowAction', event.target.value );
    }
}