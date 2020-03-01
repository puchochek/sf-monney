public with sharing class MonneyHomeController {
	public MonneyHomeController() {
	}
	@AuraEnabled
	public static String getMonneyUser(Id userId) {
		Monney_User__c currentMonneyUser = getCurrentMonneyUser(userId);
		List<Expense_Category__c> monneyUserCategoriesWithExpenses = getMonneyUserCategoriesWithExpenses(currentMonneyUser.Id);

		MonneyUserData monneyUserDataObject = buildMonneyUserDataObject(currentMonneyUser, monneyUserCategoriesWithExpenses);
		System.debug('---> monneyUserDataObject  ' + monneyUserDataObject);
		return JSON.serialize(monneyUserDataObject);
	}

	public static Monney_User__c getCurrentMonneyUser(Id userId) {
		List<Monney_User__c> monneyUsersById = MonneyUserDAO.getMonneyUserById(userId);
		Monney_User__c currentUser = new Monney_User__c();

		if(monneyUsersById.isEmpty()) {
			currentUser = MonneyUserDAO.createMonneyUser(userId);
		} else {
			currentUser = monneyUsersById [0];
		}

		return currentUser;
	}

	public static List<Expense_Category__c> getMonneyUserCategoriesWithExpenses(Id monneyUserId) {
		List<Expense_Category__c> userCategoriesWithExpenses = ExpenseCategoryDAO.getCategoriesWithExpensesByMonneyUserId(monneyUserId);
		List<Expense_Category__c> categoriesWithExpensesToBuildWrapper = new List<Expense_Category__c>();

		if(userCategoriesWithExpenses.isEmpty()) {
			Expense_Category__c incomeCategoryForNewUser = new Expense_Category__c();
			incomeCategoryForNewUser.Name = 'Income';
			incomeCategoryForNewUser.Description__c = 'Keeps your incomes data';
			incomeCategoryForNewUser.Monney_User__c = monneyUserId;
			incomeCategoryForNewUser.isIncome__c = true;
			categoriesWithExpensesToBuildWrapper = ExpenseCategoryDAO.createCategory(new List<Expense_Category__c>{ incomeCategoryForNewUser });
		} else {
			categoriesWithExpensesToBuildWrapper = userCategoriesWithExpenses;
		}

		return categoriesWithExpensesToBuildWrapper;
	}

	public static MonneyUserData buildMonneyUserDataObject(Monney_User__c monneyUser, List<Expense_Category__c> userCategoriesWithExpenses) {
		List<ExpenseCategoryData> categoriesWithExpenses = new List<ExpenseCategoryData>();

		for (Expense_Category__c category :userCategoriesWithExpenses) {
			List<ExpenseData> thisCategoryExpenses = new List<ExpenseData>();
			for (Expense__c currentExpense :category.Expenses__r) {
				ExpenseData expenseData = new ExpenseData(currentExpense);
				thisCategoryExpenses.add(expenseData);
			}

			ExpenseCategoryData currentExpenseCategoryData = new ExpenseCategoryData(category, thisCategoryExpenses);
			categoriesWithExpenses.add(currentExpenseCategoryData);
		}
		MonneyUserData currentMonneyUserData = new MonneyUserData(monneyUser, categoriesWithExpenses);

		return currentMonneyUserData;
	}

}