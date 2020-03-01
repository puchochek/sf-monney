public with sharing class MonneyUserController {
	public MonneyUserController() {
	}
	@AuraEnabled
	public static String getMonneyUser(Id userId) {
		Monney_User__c existedAppUser = new Monney_User__c();
		List<Expense_Category__c> thisUserCategoriesWithExpenses = new List<Expense_Category__c>();

		List<Monney_User__c> monneyUser = [SELECT User__c, Last_Saving_Date__c, Balance_Limit__c, Id
										   FROM Monney_User__c
										   WHERE User__c = :userId];
		if(monneyUser.isEmpty()) {
			existedAppUser = createNewMonneyUser(userId);
		} else {
			existedAppUser = monneyUser [0];
		}

		thisUserCategoriesWithExpenses = getUserCategoriesWithExpenses(existedAppUser.Id);
		return JSON.serialize(existedAppUser);
	}

	public static Monney_User__c createNewMonneyUser(Id userId) {
		Monney_User__c newAppUser = new Monney_User__c();
		newAppUser.User__c = userId;
		newAppUser.Last_Saving_Date__c = Date.today();
		newAppUser.Balance_Limit__c = 0;
		try {
			insert newAppUser;
		} catch(DmlException e) {
			System.debug('An unexpected error has occurred: ' + e.getMessage());
		}

		return newAppUser;
	}

	public static List<Expense_Category__c> getUserCategoriesWithExpenses(Id monneyUserId) {
		List<Expense_Category__c> thisUserCategoriesWithExpenses = [SELECT Id, Description__c, (SELECT Date__c, Sum__c, Comment__c FROM Expenses__r) FROM Expense_Category__c];

		// if(thisUserCategoriesWithExpenses.isEmpty()) {
		//     existedAppUser = createNewMonneyUser(userId);
		// } else {
		//     existedAppUser = thisUserCategoriesWithExpenses;
		// }

		return thisUserCategoriesWithExpenses;
	}
	//FFY QWERY SELECT Id, Description__c, (SELECT Date__c, Sum__c, Comment__c FROM Expenses__r) FROM Expense_Category__c

}