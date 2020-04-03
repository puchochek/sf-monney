import { LightningElement, api } from 'lwc';
import datatableConfig from './categoryExpensesListConfig';

const EDIT_ACTION = 'edit';
const DELETE_ACTION = 'delete';

export default class CategoryExpensesList extends LightningElement {
    category;
    expenses;
    rowOffset = 5;
    cancelBtn = 'Cancel';
    isExpenseCreateEditFormOpen;
   // categoryToEditExpense;

    @api expenseToEdit;

    @api
    get categoryToViewDetails() {
        return this._categoryToViewDetails;
    }
    set categoryToViewDetails(value) {
        this.setCategory(value);
    }

    columns = datatableConfig.columns;

    setCategory(category) {
        this.category = JSON.parse(JSON.stringify(category));
        //console.log('---> LIST this.category EXPORT COLS', this.category);
        this.expenses = this.category.expenses;
       // console.log('---> this.expenses', this.expenses);
    }

    handleRowAction(event) {
        const actionType = event.detail.action.name;
        const row = JSON.parse(JSON.stringify(event.detail.row));
        console.log('---> actionType ', actionType);
        console.log('---> row', row);
        console.log('---> actionType === EDIT_ACTION', actionType === EDIT_ACTION);
        if (actionType === EDIT_ACTION) {
            this.openExpenseCreateEditForm(row);
        } else {
            this.deleteExpense(row);
        }

    }

    openExpenseCreateEditForm(expenseToEdit) {
        this.expenseToEdit = expenseToEdit;
        this.isExpenseCreateEditFormOpen = true;
    }

    closeExpenseForm() {
        this.isExpenseCreateEditFormOpen = false;
    }

    deleteExpense(expenseToDelete) {

    }

    dispatchCloseExpensesListEvent() {
        const wasExpenseChanged = false; //Set the value dynamically when edit oe delete process succeed
        const closeExpensesList = new CustomEvent("closeexpenseslist", {
            detail: wasExpenseChanged
        });

        this.dispatchEvent(closeExpensesList);
    }
}