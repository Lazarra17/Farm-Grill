/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date: Jan 2, 2026
@Desc:
@History 

*/
public without sharing class POSProductsController {
    
    @auraEnabled
    public static List<Stock_Level__c> getProductStocks(){
         
        List<Stock_Level__c> prodStocks = [SELECT Id, Name, Available_to_Sell__c, Count_on_Hand__c, Product__r.Name, Product__r.Family FROM Stock_Level__c 
                                           WHERE Product__r.Track_Inventory__c = TRUE ORDER BY Product__r.Name];
        
        
        //return null if there is no account found
        return prodStocks;
    }
    
    
    @auraEnabled
    public static List<Stock_Level__c> updateStockLevel(string stockLevelBody, string contactId, Decimal amount){
        system.debug(stockLevelBody);
        Stock_Level__c stockLevel = (Stock_Level__c) JSON.deserialize(stockLevelBody, Stock_Level__c.class);
        
        Stock_Level__c stockToUpdate = [SELECT Id, Name, Available_to_Sell__c, Count_on_Hand__c FROM Stock_Level__c 
                                        WHERE Id =: stockLevel.Id];
        
        stockToUpdate.Available_to_Sell__c = stockToUpdate.Available_to_Sell__c + amount;
        stockToUpdate.Count_on_Hand__c = stockToUpdate.Count_on_Hand__c + amount;
        update stockToUpdate;
        
        Stock_Adjustment__c stockAdjustment = new Stock_Adjustment__c();
        stockAdjustment.Type__c = 'Inventory Added';
        stockAdjustment.POS_User__c = contactId;
        stockAdjustment.Amount__c = amount;
        stockAdjustment.Stock_Level__c = stockLevel.Id;
        
        insert stockAdjustment;
        
        List<Stock_Level__c> stocks =  getProductStocks();
        
        return stocks;
        
    }
    
    
}