public with sharing class DMLService {
	public static DMLResult insertSObjects(List<SObject> sObjectsToInsert) {
		List<Database.SaveResult> insertsedSObjects = Database.insert(sObjectsToInsert, false);
		Set<Id> insertedSObjectsIds = new Set<Id>();
		Map<System.StatusCode, String> errorMessagesByStatusCode = new Map<System.StatusCode, String>();

		for (Database.SaveResult newMoneyUsersResult :insertsedSObjects) {
			if(newMoneyUsersResult.isSuccess()) {
				insertedSObjectsIds.add(newMoneyUsersResult.getId());
			} else {
				for(Database.Error error :newMoneyUsersResult.getErrors()) {
					System.debug('The following error has occurred: ' + error.getStatusCode() + ' ' + error.getMessage());
					errorMessagesByStatusCode.put(error.getStatusCode(), error.getMessage());
				}
			}
		}

		DMLResult insertResult = new DMLResult(insertedSObjectsIds, errorMessagesByStatusCode);

		return insertResult;
	}
}