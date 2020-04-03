import insertExpense from '@salesforce/apex/ExpenseController.insertExpense';
import updateExpense from '@salesforce/apex/ExpenseController.updateExpense';

const save = (expenseToHandle) => {
    return insertExpense({ "expenses": JSON.stringify([expenseToHandle]) })
        .then(result => {
            if (result) {
                return result;
            } else {
                //TODO
            }
        });
}

const update = (expenseToHandle) => {
    return updateExpense({ "expenses": JSON.stringify([expenseToHandle]) })
        .then(result => {
            if (result) {
                return result;
            } else {
                //TODO
            }
        });
};

const ExpenseService = {
    save: save,
    update: update,
}

export { ExpenseService };