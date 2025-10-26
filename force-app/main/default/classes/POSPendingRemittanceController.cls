/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/
public without sharing class POSPendingRemittanceController {
    
    @auraEnabled
    public static List<Cash_Drawer_Item__c> getCashDrawerItems(string cashDrawerSessionId){
        List<Cash_Drawer_Item__c> cdss = [SELECT Id, Name, Type__c, Total_Amount__c, Notes__c FROM Cash_Drawer_Item__c WHERE Cash_Drawer_Session__c =: cashDrawerSessionId AND  Type__c = 'Pending Remittance'];
        if(cdss.size() > 0){
            return cdss;
        }else{
            return null;
        } 
        
    }
    
    @auraEnabled
    public static List<Opportunity> getPendingOpportunity(string cashDrawerItemId){
        List<Opportunity> oppties = [SELECT Id, Name, Payment_Status__c, StageName, Amount, Cash_Drawer_Session__c FROM Opportunity WHERE Cash_Drawer_Session__c =: cashDrawerItemId AND  Payment_Status__c = 'Pending Remittance'];
        if(oppties.size() > 0){
            return oppties;
        }else{
            return null;
        }
        
    }
    
    
    @auraEnabled
    public static List<Opportunity> updateDeliveryOpportunity(string cashDrawerItemBody, string type){
        system.debug(cashDrawerItemBody);
        Cash_Drawer_Item__c cashDrawerItem = (Cash_Drawer_Item__c) JSON.deserialize(cashDrawerItemBody, Cash_Drawer_Item__c.class);
        Map<Id, PriceBookEntry> pbeMap = new Map<Id, PriceBookEntry>();
        Set<Id> pbEntrySet = new Set<Id>();
        
        if(type == 'Cash'){
            cashDrawerItem.Type__c = 'Sales';
        }else if(type == 'GCash'){
            cashDrawerItem.Type__c = 'Sales Gcash';
        }
        
        Opportunity opp = [SELECT Id, Payment_Status__c, StageName, Cashier_Notes__c FROM Opportunity WHERE Id =: cashDrawerItem.Opportunity__c];
        opp.Payment_Status__c = 'Paid';
        opp.StageName = 'Closed Won - Delivered';
        opp.Cashier_Notes__c = cashDrawerItem.Notes__c;
        update opp;
        
        for(OpportunityLineItem opptyLine : [SELECT Id, PricebookEntryId FROM OpportunityLineItem WHERE OpportunityId =: cashDrawerItem.Opportunity__c]){
            pbEntrySet.add(opptyLine.PricebookEntryId);
            
        }
        
        //Loop PriceBookEntry from DB to avoid JS Injection
        for(PriceBookEntry pbe : [SELECT Id, UnitPrice, Product2Id FROM PriceBookEntry WHERE Id IN : pbEntrySet]){
            pbeMap.put(pbe.Id, pbe);
        }
        
        
        //Create Cash Drawer Item
        List<Cash_Drawer_Item__c> cdItems = new List<Cash_Drawer_Item__c>();
        for(OpportunityLineItem opptyLine : [SELECT Id, PricebookEntryId FROM OpportunityLineItem WHERE OpportunityId =: cashDrawerItem.Opportunity__c]){
            
            Cash_Drawer_Item__c cdi = new Cash_Drawer_Item__c();
            cdi.Cash_Drawer_Session__c = cashDrawerItem.Cash_Drawer_Session__c;
            cdi.Type__c = cashDrawerItem.Type__c;
            cdi.Custom__c = pbeMap.get(opptyLine.PricebookEntryId).UnitPrice;
            cdi.Opportunity__c = opp.Id;
            cdi.Reference_Number__c = cashDrawerItem.Reference_Number__c;
            cdi.Notes__c = cashDrawerItem.Notes__c;
            cdItems.add(cdi);
        }
        
        if(cdItems.size() > 0){
            insert cdItems;
        }
        
        List<Opportunity> oppties=  getPendingOpportunity(cashDrawerItem.Cash_Drawer_Session__c);
        
        return oppties;
        
    }
 
    @auraEnabled
    public static List<Cash_Drawer_Item__c> updateCashDrawerItems(string cashDrawerItemId, string cashDrawerItemBody, string type){
        Cash_Drawer_Item__c cashDrawerItem = (Cash_Drawer_Item__c) JSON.deserialize(cashDrawerItemBody, Cash_Drawer_Item__c.class);
        Cash_Drawer_Item__c cdi = [SELECT Id, Cash_Drawer_Session__c, Notes__c, Reference_Number__c, Type__c, Custom__c FROM Cash_Drawer_Item__c WHERE Id=: cashDrawerItemId];
    
        if(type == 'Cash'){
            cdi.Type__c = 'Sales';
        }else if(type == 'GCash'){
            cdi.Type__c = 'Sales Gcash';
        }
        
        cdi.Notes__c = cashDrawerItem.Notes__c;
        cdi.Custom__c = cashDrawerItem.Custom__c;
        cdi.Reference_Number__c = cashDrawerItem.Reference_Number__c;
        update cdi;
        
        
        List<Cash_Drawer_Item__c> cdIs = getCashDrawerItems(cdi.Opportunity__c);
       
        if(cdIs.size() > 0){
            return cdIs;
        }else{
            return null;
        }
      
        
    }
    
 
}