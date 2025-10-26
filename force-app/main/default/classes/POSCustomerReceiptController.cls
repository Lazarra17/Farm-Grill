/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public without sharing class POSCustomerReceiptController {
    
    public class ReceiptData{
        @auraEnabled
        public Opportunity oppty;
        @auraEnabled
        public List<OpportunityLineItem> opptyLines;
    }
    
    @auraEnabled
    public static ReceiptData getReceiptData(String recordId){
        system.debug('#' + recordId);
        ReceiptData receipt = new ReceiptData();
        receipt.oppty = [SELECT Id, Queue_Number__c, Amount, Cash_Tendered__c, Change__c FROM Opportunity WHERE Id =: recordId];
        receipt.opptyLines = [SELECT Id, Product2.Name, Quantity, TotalPrice FROM OpportunityLineItem WHERE OpportunityId =: recordId];
        
        return receipt;        
    }
    
  

}