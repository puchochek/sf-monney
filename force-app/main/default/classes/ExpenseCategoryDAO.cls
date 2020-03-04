public with sharing class ExpenseCategoryDAO {
	//TODO invalid select
	public static List<Expense_Category__c> getCategoriesWithExpensesByMonneyUserId(Id monneyUserId) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, Icon__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c FROM Expenses__r)
								    FROM Expense_Category__c
								    WHERE Monney_User__c = :monneyUserId];
		return categoriesWithExpenses;
	}

	public static List<Expense_Category__c> getCategoriesWithExpensesByCategoryId(Set<Id> categoryIds) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, Icon__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c FROM Expenses__r)
								    FROM Expense_Category__c
								    WHERE Id IN :categoryIds];

		return categoriesWithExpenses;

	}

	public static List<Expense_Category__c> createCategory(List<Expense_Category__c> categoriesToInsert) {
		List<Expense_Category__c> insertedCategories = new List<Expense_Category__c>();
		DMLResult insertCategoryResult = DMLService.insertSObjects(categoriesToInsert);

		if(insertCategoryResult.successRecordsIds.isEmpty()) {
			String errorMessage = MonneyException.buildErrorMessage(insertCategoryResult.errorMessagesByStatusCode);
			throw new MonneyException(errorMessage);
		} else {
			insertedCategories = getCategoriesWithExpensesByCategoryId(insertCategoryResult.successRecordsIds);
		}

		return insertedCategories;
	}
}
