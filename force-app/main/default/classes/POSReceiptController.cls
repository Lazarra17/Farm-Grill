/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public without sharing class POSReceiptController {
    
    
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
    
    @auraEnabled
    public static Cash_Drawer_Item__c getCashDrawerItem(String recordId){
        
        Cash_Drawer_Item__c cdi = [SELECT Id, Cash_Drawer_Session__r.Name, Custom__c, Notes__c, Opportunity_Product__c, Type__c, 
                                   X1000__c, X100__c, X10__c, X1__c, X200__c, X20__c, X500__c, X50__c, X5__c, 
                                   Total_Amount__c FROM Cash_Drawer_Item__c WHERE Id =: recordId];
        
        return cdi;        
    }
    
    
    
    @AuraEnabled
    public static Receipt_Setting__mdt getReceiptSettings() {
        Receipt_Setting__mdt mdt = [SELECT MasterLabel, Address__c, Contact_Number__c, Tagline__c, Title__c FROM Receipt_Setting__mdt WHERE DeveloperName = 'Farm_Grill_Receipt_Settings' LIMIT 1];
        return mdt;
    }
    
}