public with sharing class ExpenseCategoryDAO {
	public static List<Expense_Category__c> getCategoriesWithThisMonthExpensesByMonneyUserId(Id monneyUserId) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, Icon__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c
														    FROM Expenses__r
														    WHERE Date__c = THIS_MONTH
														    ORDER BY Date__c ASC) FROM Expense_Category__c
														    WHERE Monney_User__c = :monneyUserId];
		return categoriesWithExpenses;
	}

	public static List<Expense_Category__c> getCategoriesWithExpensesByCategoryId(Set<Id> categoryIds) {
		List<Expense_Category__c> categoriesWithExpenses = [SELECT Id, Name, Description__c, Monney_User__c, isIncome__c, Icon__c, (SELECT Date__c, Sum__c, Comment__c, Expense_Category__c, isIncome__c
														    FROM Expenses__r) FROM Expense_Category__c
														    WHERE Id IN :categoryIds];

		return categoriesWithExpenses;

	}

	public static List<Expense_Category__c> insertCategory(List<Expense_Category__c> categoriesToInsert) {
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

	public static List<Expense_Category__c> insertCategory(List<ExpenseCategoryData> categoriesDTO) {
		List<sObject> categoriessObjects = new List<sObject>();

		for (ExpenseCategoryData categoryDTO :categoriesDTO) {
			sObject category = buildCategorySFObjectFromCategoryDTO(categoryDTO);
			categoriessObjects.add(category);
		}
		System.debug('---> categoriessObjects ' + categoriessObjects);
		return insertCategory(categoriessObjects);
	}

	public static List<Expense_Category__c> insertCategory(ExpenseCategoryData categoryToInsert) {
		return insertCategory(new List<ExpenseCategoryData>{ categoryToInsert });
	}

	public static sObject buildCategorySFObjectFromCategoryDTO(ExpenseCategoryData categoryDTO) {
		Map<String, String> sObjectFieldByDTOField = new Map<String, String>();
		sObjectFieldByDTOField.put('Id', 'id');
		sObjectFieldByDTOField.put('Name', 'name');
		sObjectFieldByDTOField.put('isIncome__c', 'isIncome');
		sObjectFieldByDTOField.put('Description__c', 'description');
		sObjectFieldByDTOField.put('Monney_User__c', 'monneyUserId');
		sObjectFieldByDTOField.put('Icon__c', 'icon');

		Map<String, Object> categoryDTOvaluesByNames = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(categoryDTO));
		System.debug('---> categoryDTOvaluesByNames ' + categoryDTOvaluesByNames);
		sObject categorySObject = Schema.getGlobalDescribe().get('Expense_Category__c').newSObject();
		for (String key :sObjectFieldByDTOField.keySet()) {
			String categoryDTOFieldName = sObjectFieldByDTOField.get(key);
			System.debug('---> categoryDTOFieldName ' + categoryDTOFieldName);
			System.debug('---> categoryDTOvaluesByNames.get(categoryDTOFieldName) ' + categoryDTOvaluesByNames.get(categoryDTOFieldName));
			if((String) categoryDTOvaluesByNames.get(categoryDTOFieldName) != null) {
				String categoryDTOFieldValue = (String) categoryDTOvaluesByNames.get(categoryDTOFieldName);
				categorySObject.put(key, categoryDTOFieldValue);
			}

		}
		System.debug('---> categorySObject ' + categorySObject);

		return categorySObject;
	}

	public static List<Expense_Category__c> updateCategory(ExpenseCategoryData categoryToUpdate) {
		return new List<Expense_Category__c>();
	}
}