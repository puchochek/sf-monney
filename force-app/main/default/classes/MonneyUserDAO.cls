public with sharing class MonneyUserDAO {
	public static List<Monney_User__c> getMonneyUserByUserId(Id userId) {
		List<Monney_User__c> monneyUser = [SELECT User__c, Last_Saving_Date__c, Balance_Limit__c, Id
						   FROM Monney_User__c
						   WHERE User__c = :userId];

		return monneyUser;
	}

	public static List<Monney_User__c> getMonneyUserById(Set<Id> monneyUserIds) {
		List<Monney_User__c> monneyUser = [SELECT User__c, Last_Saving_Date__c, Balance_Limit__c, Id
						   FROM Monney_User__c
					           WHERE Id IN :monneyUserIds];

		return monneyUser;
	}

	public static List<Monney_User__c> createMonneyUser(Id userId) {
		Monney_User__c newAppUser = new Monney_User__c();
		newAppUser.User__c = userId;
		newAppUser.Last_Saving_Date__c = Date.today();
		newAppUser.Balance_Limit__c = 0;

		List<Monney_User__c> insertedMoneyUsers = new List<Monney_User__c>();
		DMLResult insertUserResult = DMLService.insertSObjects(new List<Monney_User__c>{ newAppUser });

		if(insertUserResult.successRecordsIds.isEmpty()) {
			String errorMessage = MonneyException.buildErrorMessage(insertUserResult.errorMessagesByStatusCode);
			throw new MonneyException(errorMessage);
		} else {
			insertedMoneyUsers = getMonneyUserById(insertUserResult.successRecordsIds);
		}

		return insertedMoneyUsers;
	}
}
