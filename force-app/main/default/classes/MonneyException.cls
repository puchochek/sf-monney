public with sharing class MonneyException extends Exception {
	public static String buildErrorMessage(Map<System.StatusCode, String> errorMessagesByStatusCode) {
		String errorMessage = 'The following errors has occurred: ';
		for (System.StatusCode errorCode :errorMessagesByStatusCode.keySet()) {
			errorMessage = errorMessage + errorCode + ': ' + errorMessagesByStatusCode.get(errorCode) + ';';
		}

		return errorMessage;
	}

}