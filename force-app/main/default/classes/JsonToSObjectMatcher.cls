public with sharing class JsonToSObjectMatcher {

    public static List<sObject> convertDTOsToSObjects(String dtosJSON, String dtoObjectName) {
		Set<String> dtosFieldNames = getDTOFieldsNames(dtosJSON);
		System.debug('---> dtosFieldNames ' + dtosFieldNames);
		List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping = getJSONToSObjectsCustomMetadata(dtosFieldNames, dtoObjectName);
		System.debug('---> jsonToSObjectFieldMapping ' + jsonToSObjectFieldMapping);

		List<SObject> convertedSObjects = new List<SObject>();
		Map<String, String> sObjectFieldsByDTOFields = getSObjectFieldsByDTOFields(jsonToSObjectFieldMapping);
		System.debug('---> sObjectFieldsByDTOFields ' + sObjectFieldsByDTOFields);
		String convertToObjectName = jsonToSObjectFieldMapping[0].sObject_name__c;
		sObject sObjectInstance = Schema.getGlobalDescribe().get(convertToObjectName).newSObject();

		Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
		Schema.SObjectType ctype = gd.get(convertToObjectName);
		Map<String, Schema.SobjectField> fmap = ctype.getDescribe().fields.getMap();
		for (String key : fmap.keySet()) {
			System.debug('--->  ' + key + ' ' + fmap.get(key).getDescribe().getName());
			System.debug('--->  ' + fmap.get(key).getDescribe().getType());
		}

		List<Map<String, String>> dtoObjects = (List<Map<String, String>>) JSON.deserialize(dtosJSON, List<Map<String, String>>.class);
		for (Map<String, String> dto : dtoObjects) {
			for (String key : sObjectFieldsByDTOFields.keySet()) {
				sObjectInstance.put(sObjectFieldsByDTOFields.get(key), dto.get(key));
			}
			convertedSObjects.add(sObjectInstance);
		}

		System.debug('---> convertedSObjects ' + convertedSObjects);
		return convertedSObjects;
	}

	private static Set<String> getDTOFieldsNames(String dtosJSON) {
		List<Map<String, String>> dtoObjects = (List<Map<String, String>>) JSON.deserialize(dtosJSON, List<Map<String, String>>.class);
		Set<String> dtosFieldNames = dtoObjects[0].keySet();

		return dtosFieldNames;
	}

    private static List<JSON_to_sObject_mapping__mdt> getJSONToSObjectsCustomMetadata(Set<String> dtosFieldNames, String dtoObjectName) {
        List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping = [SELECT JSON_field_name__c, JSON_object_name__c, sObject_field__c, sObject_name__c 
                                                                        FROM JSON_to_sObject_mapping__mdt 
																		WHERE JSON_field_name__c IN :dtosFieldNames
																		AND JSON_object_name__c = :dtoObjectName];

        return jsonToSObjectFieldMapping;
	}

	private static Map<String, String> getSObjectFieldsByDTOFields(List<JSON_to_sObject_mapping__mdt> jsonToSObjectFieldMapping) {
		Map<String, String> sObjectFieldsByDTOFields= new Map<String, String>();
		//TODO Map<String, Map<String, String>> sObjectFieldsWithTypesByDTOFields

		for (JSON_to_sObject_mapping__mdt jsonToObjectMapping : jsonToSObjectFieldMapping) {
			sObjectFieldsByDTOFields.put(jsonToObjectMapping.JSON_field_name__c, jsonToObjectMapping.sObject_field__c);
		}

		return sObjectFieldsByDTOFields;
	}
}
