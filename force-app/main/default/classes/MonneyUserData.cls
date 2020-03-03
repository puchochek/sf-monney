public with sharing class MonneyUserData {
	public String userId;
	public Date lastSavingDate;
	public Decimal balanceLimit;
	public String id;
	public List<ExpenseCategoryData> categoriesWithExpenses;

	public MonneyUserData(Monney_User__c currentUser, List<ExpenseCategoryData> categoriesWithExpenses) {
		this.userId = currentUser.User__c;
		this.lastSavingDate = currentUser.Last_Saving_Date__c;
		this.balanceLimit = currentUser.Balance_Limit__c;
		this.id = currentUser.Id;
		this.categoriesWithExpenses = categoriesWithExpenses;
	}
}
