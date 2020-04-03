public with sharing class ExpenseController {

    public static final String EXPENSE_DTO_NAME = 'ExpenseData';

	@AuraEnabled
	public static String insertExpense(String expenses) {
		try {
			List<Expense__c> expensesToInsert = JsonToSObjectMatcher.convertDTOsToSObjects(expenses, EXPENSE_DTO_NAME);
			List<Expense__c> insertedExpenses = ExpenseDAO.insertExpenses(expensesToInsert);

			return JSON.serialize(insertedExpenses);
		} catch(Exception e) {
			System.debug('The following error occured while saving an Expense: ' + e);
			return null;
		}
	}

	@AuraEnabled
	public static String updateExpense(String expenses) {
		//TODO
		return JSON.serialize('insertedExpenses');
	}
}