public with sharing class ExpenseCategoryDAO {

	public static List<Expense_Category__c> getCategoriesWithExpensesByMonneyUserId(Id monneyUserId) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c FROM Expenses__r) FROM Expense_Category__c
														    WHERE Monney_User__c = :monneyUserId];
		return categoriesWithExpenses;
	}

	public static List<Expense_Category__c> getCategoriesWithExpensesByCategoryId(Set<Id> categoryIds) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c FROM Expenses__r) FROM Expense_Category__c
														    WHERE Id IN :categoryIds];

		return categoriesWithExpenses;

	}

	public static List<Expense_Category__c> createCategory(List<Expense_Category__c> categoriesToInsert) {
		List<Database.SaveResult> newExpensesCategories = Database.insert(categoriesToInsert, false);
		Set<Id> createdCategoriesIds = new Set<Id>();

		for (Database.SaveResult createdCategoryResult :newExpensesCategories) {
			if(createdCategoryResult.isSuccess()) {
				createdCategoriesIds.add(createdCategoryResult.getId());
			} else {
				for(Database.Error error :createdCategoryResult.getErrors()) {
					System.debug('The following error has occurred: ' + error.getStatusCode() + ' ' + error.getMessage());
				}
			}
		}

        List<Expense_Category__c> insertedCategories = new List<Expense_Category__c>();
		if(!createdCategoriesIds.isEmpty()) {
			insertedCategories = getCategoriesWithExpensesByCategoryId(createdCategoriesIds);
		}

		return insertedCategories;
	}
}