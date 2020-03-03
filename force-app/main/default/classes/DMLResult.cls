public with sharing class DMLResult {
	public Set<Id> successRecordsIds;
	public Map<System.StatusCode, String> errorMessagesByStatusCode;

	public DMLResult(Set<Id> successRecordsIds, Map<System.StatusCode, String> errorMessagesByStatusCode) {
		this.successRecordsIds = successRecordsIds;
		this.errorMessagesByStatusCode = errorMessagesByStatusCode;
	}
}