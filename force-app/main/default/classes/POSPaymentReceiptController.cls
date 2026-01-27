/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public without sharing class POSPaymentReceiptController {
    
    
    public class ReceiptData{
        @auraEnabled
        public Payment__c payment;
    }
    
    @auraEnabled
    public static ReceiptData getReceiptData(String recordId){
        system.debug('#' + recordId);
        ReceiptData receipt = new ReceiptData();
        receipt.payment = [SELECT Id, Name, Loan_Advance__r.Name, Contact__r.Name, POS_User__r.Name, Date__c, Amount__c, Loan_Amount__c FROM Payment__c WHERE Id =: recordId];
      
        
        return receipt;        
    }
    
 
    @AuraEnabled
    public static Receipt_Setting__mdt getReceiptSettings() {
        Receipt_Setting__mdt mdt = [SELECT MasterLabel, Address__c, Contact_Number__c, Tagline__c, Title__c FROM Receipt_Setting__mdt WHERE DeveloperName = 'Farm_Grill_Receipt_Settings' LIMIT 1];
        return mdt;
    }
    
}