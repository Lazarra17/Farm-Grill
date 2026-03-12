/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/  
public class StockLevelTriggerHandler extends TriggerHandler{
    
    private Map<Id, Stock_Level__c> newStockLevelMap;
    private List<Stock_Level__c> newStockLevel;
    
    public StockLevelTriggerHandler() {
        this.newStockLevelMap = (Map<Id, Stock_Level__c>) Trigger.newMap;
        this.newStockLevel = (List<Stock_Level__c>) Trigger.new;
    }
    
    public override void afterUpdate() {
        
        Set<Id> noStockProdIdsSet = new Set<Id>();
        Set<Id> inStockProdIdsSet = new Set<Id>();
        Map<Id, Stock_Level__c> stockLevelMap = new Map<Id, Stock_Level__c>(newStockLevel);
        Map<Id, Product_Catalog_Item__c> prodCatalogItemMap = new Map<Id, Product_Catalog_Item__c>();
        
        
        
        //Get the affected products.  
        for(Product_Stock_Level__c psl : [SELECT Id, Stock_Level__c, Product__c, Available_to_Sell__c 
                                          FROM Product_Stock_Level__c WHERE Stock_Level__c IN : newStockLevel]){
                                              
                                              if(stockLevelMap.containsKey(psl.Stock_Level__c)){
                                                  
                                                  if(stockLevelMap.get(psl.Stock_Level__c).Available_to_Sell__c <= 0){
                                                      noStockProdIdsSet.add(psl.Product__c);
                                                      
                                                  }else{
                                                      inStockProdIdsSet.add(psl.Product__c);
                                                  }
                                                  
                                              }
                                          }
        
        //Search all Product Catalog Item where to update 
        List<Product_Catalog_Item__c> PCIToUpdate = new List<Product_Catalog_Item__c>();
		

        //get all No Stock Products        
        for(Product_Catalog_Item__c pci : [SELECT Id, Product__c, TECH_InStock__c FROM Product_Catalog_Item__c WHERE Product__c IN : noStockProdIdsSet]){
            
            pci.TECH_InStock__c = false;
            PCIToUpdate.add(pci);   
        }
        
        //get all In Stock Products   
        
        for(Product_Catalog_Item__c pci : [SELECT Id, Product__c, TECH_InStock__c FROM Product_Catalog_Item__c WHERE Product__c IN : inStockProdIdsSet]){
            
            pci.TECH_InStock__c = true;
            PCIToUpdate.add(pci);   
        }
         
        if(PCIToUpdate.size() > 0){
            update PCIToUpdate;
        }
        
    }
    
}