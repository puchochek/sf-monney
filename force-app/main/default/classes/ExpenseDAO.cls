public with sharing class ExpenseDAO {
	public static List<Expense__c> getExpensesById(Set<Id> ids) {
		List<Expense__c> expensesById = [SELECT Id, Expense_Category__c, Date__c, Sum__c, Comment__c, isIncome__c
									     FROM Expense__c
									     WHERE Id IN :ids];

		return expensesById;
	}

	public static List<Expense__c> insertExpenses(List<Expense__c> expensesToInsert) {
		System.debug('---> expensesToInsert ' + expensesToInsert);
		List<Expense__c> insertedExpenses = new List<Expense__c>();
		DMLResult insertExpensesResult = DMLService.insertSObjects(expensesToInsert);

		if(insertExpensesResult.successRecordsIds.isEmpty()) {
			String errorMessage = MonneyException.buildErrorMessage(insertExpensesResult.errorMessagesByStatusCode);
			throw new MonneyException(errorMessage);
		} else {
			insertedExpenses = getExpensesById(insertExpensesResult.successRecordsIds);
		}

		return insertedExpenses;
	}

	public static List<Expense__c> updateExpense(ExpenseData expense) {
		return new List<Expense__c>();
	}
}