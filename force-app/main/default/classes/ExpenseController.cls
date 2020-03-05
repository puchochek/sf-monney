public with sharing class ExpenseController {
	@AuraEnabled
	public static String save(String expenseJSON) {
		try {
			ExpenseData expense = (ExpenseData) JSON.deserialize(expenseJSON, ExpenseData.class);
			List<Expense__c> upsertedExpenses = expense.id == null ? ExpenseDAO.insertExpense(expense) :ExpenseDAO.updateExpense(expense);
			List<ExpenseData> expenses = buildExpenseData(upsertedExpenses);

			return JSON.serialize(expenses);
		} catch(Exception e) {
			System.debug('The following error occured whole saving an Expense: ' + e);
			return null;
		}
	}

	public static List<ExpenseData> buildExpenseData(List<Expense__c> upsertedExpenses) {
		List<ExpenseData> expenses = new List<ExpenseData>();

		for (Expense__c expense :upsertedExpenses) {
			ExpenseData expenseData = new ExpenseData(expense);
			expenses.add(expenseData);
		}

		return expenses;
	}
}