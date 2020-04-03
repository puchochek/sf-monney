public with sharing class ExpenseCategoryController {

	public static final String EXPENSE_CATEGORY_DTO_NAME = 'ExpenseCategoryData';

	@AuraEnabled
	public static String createCategory(String categories) {
		try {
			List<Expense_Category__c> categoriesToInsert = JsonToSObjectMatcher.convertDTOsToSObjects(categories, EXPENSE_CATEGORY_DTO_NAME);
			List<Expense_Category__c> insertedCategories = ExpenseCategoryDAO.insertCategories(categoriesToInsert);

			return JSON.serialize(insertedCategories);
		} catch(Exception e) {
			System.debug('The following error occured while saving an Category: ' + e);
			return null;
		}
	}

	@AuraEnabled
	public static String updateCategory(String categories) {
		try {
			List<Expense_Category__c> categoriesToUpdate = JsonToSObjectMatcher.convertDTOsToSObjects(categories, EXPENSE_CATEGORY_DTO_NAME);
			List<Expense_Category__c> updatedCategories = ExpenseCategoryDAO.updateCategories(categoriesToUpdate);

			return JSON.serialize(updatedCategories);
		} catch(Exception e) {
			System.debug('The following error occured while saving an Category: ' + e);
			return null;
		}
	}
}