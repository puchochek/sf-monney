public with sharing class ExpenseCategoryData {
	public String id;
	public String name;
	public Boolean isIncome;
	public String description;
	public String monneyUserId;
	public String icon;
	public List<ExpenseData> expenses;

	public ExpenseCategoryData(Expense_Category__c expenseCategory, List<ExpenseData> expenses) {
		this.id = expenseCategory.Id;
		this.name = expenseCategory.Name;
		this.isIncome = expenseCategory.isIncome__c;
		this.description = expenseCategory.Description__c;
		this.monneyUserId = expenseCategory.Monney_User__c;
		this.icon = expenseCategory.Icon__c;
		this.expenses = expenses;
	}
}