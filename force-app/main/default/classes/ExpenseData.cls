public with sharing class ExpenseData {
	public String id;
	public String category;
	public Date transactionDate;
	public Decimal sum;
	public String comment;
	public Boolean isIncome;

	public ExpenseData(Expense__c expense) {
		this.id = expense.Id;
		this.category = expense.Expense_Category__c;
		this.transactionDate = expense.Date__c;
		this.sum = expense.Sum__c;
		this.comment = expense.Comment__c;
		this.isIncome = expense.isIncome__c;
	}
}