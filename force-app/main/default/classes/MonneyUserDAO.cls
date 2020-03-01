public with sharing class MonneyUserDAO {

	public static List<Monney_User__c> getMonneyUserById(Id userId) {
		List<Monney_User__c> monneyUser = [SELECT User__c, Last_Saving_Date__c, Balance_Limit__c, Id
										   FROM Monney_User__c
										   WHERE User__c = :userId];

		return monneyUser;
	}

	public static Monney_User__c createMonneyUser(Id userId) {
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
}