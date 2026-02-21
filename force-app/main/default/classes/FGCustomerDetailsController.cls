/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public without sharing class FGCustomerDetailsController {
    
    @AuraEnabled
    public static List<String> getPicklistValues(String objectName, String fieldName) {
        List<String> options = new List<String>();
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        
        List<Schema.PicklistEntry> values = fieldMap.get(fieldName).getDescribe().getPickListValues();
        
        for (Schema.PicklistEntry entry : values) {
            options.add(entry.getLabel());
        }
        return options;
    }
    
    @AuraEnabled
    public static List<Lead_Line_Item__c> getLeadItems(String leadId){
        
        List<Lead_Line_Item__c> lineItems = [SELECT Id, Product__c, Product__r.Name,Product__r.Product_Image_Url__c, Quantity__c, Total_Price__c, Product__r.Resto_Site_Display_Name__c 
                                             FROM Lead_Line_Item__c WHERE Lead__c =: leadId ORDER BY TECH_MainProduct__c DESC];
        
        return lineItems; 
    }
    
    @AuraEnabled
    public static List<Lead_Line_Item__c> addDelivery(String leadId, String barangay){
        
        List<Lead_Line_Item__c> lineItems = [SELECT Id, Product__c, Product__r.Name,Product__r.Product_Image_Url__c, Quantity__c, Total_Price__c, Product__r.Resto_Site_Display_Name__c 
                                             FROM Lead_Line_Item__c WHERE Lead__c =: leadId ORDER BY TECH_MainProduct__c DESC];
        
        return lineItems; 
    }
    
}