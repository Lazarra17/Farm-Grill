/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public without sharing class POSLoanReceiptController {
    
    
    public class ReceiptData{
        @auraEnabled
        public Loan_Advance__c loan;
    }
    
    @auraEnabled
    public static ReceiptData getReceiptData(String recordId){
        system.debug('#' + recordId);
        ReceiptData receipt = new ReceiptData();
        receipt.loan = [SELECT Id, Name, Date__c, Amount__c, Description__c, Loan_Type__c, Contact__r.Name, POS_User__r.Name FROM Loan_Advance__c WHERE Id =: recordId];
      
        
        return receipt;        
    }
    
 
    @AuraEnabled
    public static Receipt_Setting__mdt getReceiptSettings() {
        Receipt_Setting__mdt mdt = [SELECT MasterLabel, Address__c, Contact_Number__c, Tagline__c, Title__c FROM Receipt_Setting__mdt WHERE DeveloperName = 'Farm_Grill_Receipt_Settings' LIMIT 1];
        return mdt;
    }
    
}