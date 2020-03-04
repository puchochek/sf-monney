public with sharing class ExpenseController {
	@AuraEnabled
	public static String save(String expenseJSON) {
		ExpenseData expense = (ExpenseData) JSON.deserialize(expenseJSON, ExpenseData.class);
		System.debug('--->  tpd ' + expense);
		try {
			List<Expense__c> upsertedExpenses = expense.id == null ? ExpenseDAO.insertExpense(expense) : ExpenseDAO.updateExpense(expense);
			System.debug('---> upsertedExpense ' + upsertedExpenses);
			return JSON.serialize(upsertedExpenses);
		} catch(Exception e) {
			System.debug(e);
			return null;
		}
		//return 'hello';
	}


}