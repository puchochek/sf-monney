public with sharing class ExpenseCategoryController {
	@AuraEnabled
	public static String save(String categoryJSON) {
		try {
			System.debug('---> categoryJSON ' + categoryJSON);
			ExpenseCategoryData category = (ExpenseCategoryData) JSON.deserialize(categoryJSON, ExpenseCategoryData.class);
			System.debug('---> category ' + category);
			List<Expense_Category__c> upsertedCategories = category.id == null ?
            ExpenseCategoryDAO.insertCategory(category)
            : ExpenseCategoryDAO.updateCategory(category);
			System.debug('---> upsertedCategories ' + upsertedCategories);
			// List<ExpenseData> expenses = buildExpenseData(upsertedExpenses);

			return JSON.serialize('expenses');
		} catch(Exception e) {
			System.debug('The following error occured whole saving an Category: ' + e);
			return null;
		}
	}

	// public static List<ExpenseData> buildExpenseData(List<Expense__c> upsertedExpenses) {
	//     List<ExpenseData> expenses = new List<ExpenseData>();

	//     for (Expense__c expense :upsertedExpenses) {
	//         ExpenseData expenseData = new ExpenseData(expense);
	//         expenses.add(expenseData);
	//     }

	//     return expenses;
	// }
}