public class FGUtilities {
    
    @AuraEnabled
    public static List<Stock_Level__c> checkProductsStockList(Lead lead){
        
        Map<String, Lead_Line_Item__c> leadItemMap = new Map<String, Lead_Line_Item__c>();
        for(Lead_Line_Item__c li : [SELECT Id, Product__c, TECH_MainProduct__c, Product__r.Name, Product__r.Resto_Site_Display_Name__c, Quantity__c, Total_Price__c, Unit_Price__c, Special_Notes__c, TECH_PricebookEntry__c
                                    FROM Lead_Line_Item__c WHERE Lead__c =: lead.Id AND Product__r.Track_Inventory__c = TRUE]){
                                        
                                        
                                        leadItemMap.put(li.Product__c, li);
                                        
                                        
                                        
                                    }
        
        Map<Id, Stock_Level__c> currentStockLevelMap = new Map<Id, Stock_Level__c>(); 
        for(Product_Stock_Level__c psl : [SELECT Id, Product__c, Stock_Level__c, Available_to_Sell__c, Units__c FROM Product_Stock_Level__c WHERE Product__c IN : leadItemMap.keySet()]){
            
            
            if(leadItemMap.containsKey(psl.Product__c)){
                
                if(currentStockLevelMap.containsKey(psl.Stock_Level__c)){
                    //Current quantity + the new units sold
                    currentStockLevelMap.get(psl.Stock_Level__c).Change_Quantity__c = currentStockLevelMap.get(psl.Stock_Level__c).Change_Quantity__c + (leadItemMap.get(psl.Product__c).Quantity__c * psl.Units__c);
                }else{
                    
                    Stock_Level__c sl = new Stock_Level__c();
                    sl.Id = psl.Stock_Level__c;
                    sl.Change_Quantity__c = leadItemMap.get(psl.Product__c).Quantity__c * psl.Units__c;
                    currentStockLevelMap.put(psl.Stock_Level__c, sl);
                }
                
                
            }
            
            
            
            
        }
        
        
        //Make the change quantity negative value
        for(String slKey : currentStockLevelMap.KeySet()){
            
            if(currentStockLevelMap.containsKey(slKey)){
                currentStockLevelMap.get(slKey).Change_Quantity__c = -(currentStockLevelMap.get(slKey).Change_Quantity__c);
            }
            
        } 
        
        
        for(Product_Stock_Level__c psl : [SELECT Id, Product__c, Stock_Level__c, Stock_Level__r.Name, Available_to_Sell__c, Units__c FROM Product_Stock_Level__c 
                                          WHERE Product__c IN : leadItemMap.keySet()]){
                                              
                                              if(currentStockLevelMap.containsKey(psl.Stock_Level__c)){
                                                  //Change Quantity is in NEgative so that the stock gets minus because of flow
                                                  Decimal stockCount = psl.Available_to_Sell__c + currentStockLevelMap.get(psl.Stock_Level__c).Change_Quantity__c;
                                                  if(stockCount < 0){
                                                      
                                                      try {
                                                          Map<String, String> errorMap = new Map<String, String>{
                                                              'code' => '400',
                                                                  'message' => 'ERROR: ' + psl.Stock_Level__r.Name + ' is out of stock or not enough. Please remove it from your Cart. \n  Available stock is ' + psl.Available_to_Sell__c ,
                                                                  'severity' => 'High'
                                                                  };
                                                                      throw new AuraHandledException(JSON.serialize(errorMap));
                                                          
                                                      } catch (Exception e) {
                                                          // If it's already an AuraHandledException, rethrow it
                                                          if(e instanceof AuraHandledException) throw e;
                                                          // Otherwise, wrap the system error
                                                          throw new AuraHandledException('System Error: ' + e.getMessage());
                                                      }
                                                      
                                                  }
                                                  
                                              }
                                              
                                          }
        
        if(currentStockLevelMap.size() > 0){
            
        }
        
        return currentStockLevelMap.values();
    }
    
}