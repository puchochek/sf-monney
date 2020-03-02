public with sharing class MonneyUserDAO {
	public static List<Monney_User__c> getMonneyUserByUserId(Id userId) {
		return getMonneyUserById(new Set<Id>{ userId });
	}

	public static List<Monney_User__c> getMonneyUserByUserId(Set<Id> userIds) {
		List<Monney_User__c> monneyUser = [SELECT User__c, Last_Saving_Date__c, Balance_Limit__c, Id
										   FROM Monney_User__c
										   WHERE User__c IN :userIds];

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

		List<Database.SaveResult> newMoneyUsers = Database.insert(new List<Monney_User__c>{newAppUser}, false);
		Set<Id> createdMonneyUsersIds = new Set<Id>();

		for (Database.SaveResult newMoneyUsersResult :newMoneyUsers) {
			if(newMoneyUsersResult.isSuccess()) {
				createdMonneyUsersIds.add(newMoneyUsersResult.getId());
			} else {
				for(Database.Error error :newMoneyUsersResult.getErrors()) {
					System.debug('The following error has occurred: ' + error.getStatusCode() + ' ' + error.getMessage());
				}
			}
		}

		List<Monney_User__c> insertedMoneyUsers = new List<Monney_User__c>();
		if(!createdMonneyUsersIds.isEmpty()) {
			insertedMoneyUsers = getMonneyUserById(createdMonneyUsersIds);
		}

		return insertedMoneyUsers;
	}
}