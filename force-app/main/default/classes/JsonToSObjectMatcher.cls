public with sharing class JsonToSObjectMatcher {

    public static List<sObject> convertDTOsToSObjects(String dtosJSON) {
		Set<String> dtosFieldNames = getDTOFieldsNames(dtosJSON);
		List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping = getJSONToSObjectsCustomMetadata(dtosFieldNames);
		Boolean areTheSameObjectFields = verifyFieldsObjectType(jsonToSObjectFieldMapping);

		List<SObject> convertedSObjects = new List<SObject>();
		if (areTheSameObjectFields) {
			Map<String, String> sObjectFieldsByDTOFields = getSObjectFieldsByDTOFields(jsonToSObjectFieldMapping);
			String convertToObjectName = jsonToSObjectFieldMapping[0].sObject_name__c;
			sObject sObjectInstance = Schema.getGlobalDescribe().get(convertToObjectName).newSObject();

			List<Map<String, String>> dtoObjects = (List<Map<String, String>>) JSON.deserialize(dtosJSON, List<Map<String, String>>.class);
			for (Map<String, String> dto : dtoObjects) {
				for (String key : sObjectFieldsByDTOFields.keySet()) {
					sObjectInstance.put(sObjectFieldsByDTOFields.get(key), dto.get(key));
				}
				convertedSObjects.add(sObjectInstance);
			}
		} else {
			String errorMessage = 'Fields belongs to a different sObjects. DML is impossible.';
			throw new MonneyException(errorMessage);
		}

		System.debug('---> convertedSObjects ' + convertedSObjects);
		return convertedSObjects;
	}

	private static Set<String> getDTOFieldsNames(String dtosJSON) {
		List<Map<String, String>> dtoObjects = (List<Map<String, String>>) JSON.deserialize(dtosJSON, List<Map<String, String>>.class);
		Set<String> dtosFieldNames = dtoObjects[0].keySet();

		return dtosFieldNames;
	}

    private static List<JSON_to_sObject_mapping__mdt> getJSONToSObjectsCustomMetadata(Set<String> dtosFieldNames) {
        List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping = [SELECT JSON_field_name__c, JSON_object_name__c, sObject_field__c, sObject_name__c 
                                                                        FROM JSON_to_sObject_mapping__mdt 
                                                                        WHERE JSON_field_name__c IN :dtosFieldNames];

        return jsonToSObjectFieldMapping;
	}

	private static boolean verifyFieldsObjectType(List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping) {
		Boolean areAllFieldsBelongsToOneSObject = true;

		for (Integer i = 1; i < jsonToSObjectFieldMapping.size(); i++) {
			JSON_to_sObject_mapping__mdt currentMtdFieldMapping = jsonToSObjectFieldMapping[i];
			JSON_to_sObject_mapping__mdt previouseMtdFieldMapping = jsonToSObjectFieldMapping[i - 1];

			if (currentMtdFieldMapping.sObject_name__c != previouseMtdFieldMapping.sObject_name__c) {
				areAllFieldsBelongsToOneSObject = false;
			}
		}

		return areAllFieldsBelongsToOneSObject;
	}

	private static Map<String, String> getSObjectFieldsByDTOFields(List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping) {
		Map<String, String> sObjectFieldsByDTOFields= new Map<String, String>();

		for (JSON_to_sObject_mapping__mdt jsonToObjectMapping : jsonToSObjectFieldMapping) {
			sObjectFieldsByDTOFields.put(jsonToObjectMapping.JSON_field_name__c, jsonToObjectMapping.sObject_field__c);
		}

		return sObjectFieldsByDTOFields;
	}
}
