public with sharing class ExpenseDAO {
	public static List<Expense__c> getExpensesById(Set<Id> ids) {
		List<Expense__c> expensesById = [SELECT Id, Expense_Category__c, Date__c, Sum__c, Comment__c, isIncome__c
									     FROM Expense__c
									     WHERE Id IN :ids];

		return expensesById;
	}

	public static List<Expense__c> insertExpense(ExpenseData expense) {
		Expense__c expenseToSave = buildExpenseToSave(expense);
		List<Expense__c> insertedExpenses = new List<Expense__c>();
		DMLResult insertExpenseResult = DMLService.insertSObjects(new List<Expense__c>{ expenseToSave });

		if(insertExpenseResult.successRecordsIds.isEmpty()) {
			String errorMessage = MonneyException.buildErrorMessage(insertExpenseResult.errorMessagesByStatusCode);
			throw new MonneyException(errorMessage);
		} else {
			insertedExpenses = getExpensesById(insertExpenseResult.successRecordsIds);
		}

		return insertedExpenses;
	}

	public static List<Expense__c> updateExpense(ExpenseData expense) {
		return new List<Expense__c>();
	}

	private static Expense__c buildExpenseToSave(ExpenseData expense) {
        System.debug('---> expenseToSave b' + expense);
		Expense__c expenseToSave = new Expense__c();
		expenseToSave.Id = expense.id;
		expenseToSave.Expense_Category__c = expense.category;
		expenseToSave.Date__c = expense.transactionDate;
		expenseToSave.Sum__c = expense.sum;
		expenseToSave.Comment__c = expense.comment;
		expenseToSave.isIncome__c = expense.isIncome;
		System.debug('---> expenseToSave a' + expenseToSave);
		return expenseToSave;
	}
}