/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/  
public without sharing class FGCartController {
    
    @AuraEnabled
    public static List<Lead_Line_Item__c> getLeadItems(String leadId){
        
        List<Lead_Line_Item__c> lineItems = [SELECT Id, Product__c, Product__r.Name,Product__r.Product_Image_Url__c, Quantity__c, Total_Price__c, Product__r.Resto_Site_Display_Name__c 
                                             FROM Lead_Line_Item__c WHERE Lead__c =: leadId ORDER BY TECH_MainProduct__c DESC];
        if(lineItems.size() > 0){
           return lineItems;  
        }else{
            return null;
        }
        
    }
    
    
    @AuraEnabled
    public static Lead_Line_Item__c updateLeadItem(String leadItemId, string method){
        
        Lead_Line_Item__c lineItem = [SELECT Id, Product__c, Product__r.Name,Product__r.Product_Image_Url__c, Quantity__c, Total_Price__c, Product__r.Resto_Site_Display_Name__c 
                                             FROM Lead_Line_Item__c WHERE Id =: leadItemId];
        
        if(method == 'ADD'){
            lineItem.Quantity__c = lineItem.Quantity__c + 1;
        }else{
            lineItem.Quantity__c = lineItem.Quantity__c - 1;
        }
         
        update lineItem;
        
        return lineItem; 
    }
    
      @AuraEnabled
    public static void deleteItem(String leadItemId){
        
        Lead_Line_Item__c lineItem = [SELECT Id FROM Lead_Line_Item__c WHERE Id =: leadItemId];
        
        delete lineItem;
        
    }

    
}