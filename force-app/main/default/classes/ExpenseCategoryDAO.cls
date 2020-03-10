public with sharing class ExpenseCategoryDAO {
	public static List<Expense_Category__c> getCategoriesWithThisMonthExpensesByMonneyUserId(Id monneyUserId) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, Icon__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c
														    FROM Expenses__r
														    WHERE Date__c = THIS_MONTH
														    ORDER BY Date__c DESC) FROM Expense_Category__c
														    WHERE Monney_User__c = :monneyUserId];
		return categoriesWithExpenses;
	}

	public static List<Expense_Category__c> getCategoriesWithExpensesByCategoryId(Set<Id> categoryIds) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, Icon__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c
														    FROM Expenses__r) FROM Expense_Category__c
														    WHERE Id IN :categoryIds];

		return categoriesWithExpenses;

	}

	public static List<Expense_Category__c> insertCategories(List<Expense_Category__c> categoriesToInsert) {
		List<Expense_Category__c> insertedCategories = new List<Expense_Category__c>();
		DMLResult insertCategoriesResult = DMLService.insertSObjects(categoriesToInsert);

		if(insertCategoriesResult.successRecordsIds.isEmpty()) {
			String errorMessage = MonneyException.buildErrorMessage(insertCategoriesResult.errorMessagesByStatusCode);
			throw new MonneyException(errorMessage);
		} else {
			insertedCategories = getCategoriesWithExpensesByCategoryId(insertCategoriesResult.successRecordsIds);
		}

		return insertedCategories;
	}

	public static List<Expense_Category__c> updateCategories(List<Expense_Category__c> categoryToUpdate) {
		return new List<Expense_Category__c>();
	}
}