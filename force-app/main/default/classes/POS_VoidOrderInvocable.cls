/*
* @Author: Chad Lazarra
* @Date: 2-Feb-26
* @Desc:
*/
public without sharing class POS_VoidOrderInvocable {
    
    @InvocableMethod(label='Void Order' description='Accepts a record ID and performs custom logic' category='Opportunity')
    public static void voidOrder(List<Id> recordIds) {
        List<String> results = new List<String>();
        
  
        if (recordIds == null || recordIds.isEmpty()) {
            return;
        }
        
    
        Opportunity oppty = [SELECT Id, Name FROM Opportunity WHERE Id IN :recordIds LIMIT 1];
        Map<Id, Decimal> prodQuantityMap = new Map<Id, Decimal>();
   
        for (OpportunityLineItem opptyLine : [SELECT Id, Product2Id, Quantity FROM OpportunityLineItem WHERE OpportunityId =: oppty.Id AND Product2.Track_Inventory__c = true]) {
            if(prodQuantityMap.containsKey(opptyLine.Product2Id)){
                prodQuantityMap.put(opptyLine.Product2Id,  prodQuantityMap.get(opptyLine.Product2Id) + opptyLine.Quantity);
            }else{
                prodQuantityMap.put(opptyLine.Product2Id, opptyLine.Quantity);
            }
            
        }
        system.debug('prodQuantityMap: ' + prodQuantityMap);
        if(prodQuantityMap.size() > 0){
            List<Stock_Level__c> stockLevelToUpdate = new List<Stock_Level__c>();
            Map<Id, Decimal> stockLevelMap = new Map<Id, Decimal>();
            Map<Id, Id> prodStockLvlMap = new Map<Id, Id>();
            
            for(Product_Stock_Level__c psl : [SELECT Id, Stock_Level__c, Product__c FROM Product_Stock_Level__c WHERE Product__c IN : prodQuantityMap.keySet()]){
                
                prodStockLvlMap.put(psl.Product__c, psl.Stock_Level__c);
                
            }
            
            for(Product_Stock_Level__c psl : [SELECT Id, Stock_Level__c, Product__c FROM Product_Stock_Level__c WHERE Product__c IN : prodQuantityMap.keySet()]){
                 
                if(prodQuantityMap.containsKey(psl.Product__c)){
                    
                    if(stockLevelMap.containsKey(psl.Stock_Level__c)){
                        stockLevelMap.put(psl.Stock_Level__c, stockLevelMap.get(psl.Stock_Level__c) + prodQuantityMap.get(psl.Product__c));
                    }else{
                        stockLevelMap.put(psl.Stock_Level__c, prodQuantityMap.get(psl.Product__c));
                    }
                    
                    /*
                    if(stockLevelMap.containsKey(psl.Stock_Level__c)){
                        stockLevelMap.put(psl.Stock_Level__c, stockLevelMap.get(psl.Stock_Level__c) + prodQuantityMap.get(psl.Product__c));
                        
                    }else{
                        stockLevelMap.put(psl.Stock_Level__c, prodQuantityMap.get(psl.Product__c));
                        
                    }
                    
                    Stock_Level__c sl = new Stock_Level__c();
                    sl.Id = psl.Stock_Level__c;
                    sl.Change_Quantity__c = prodQuantityMap.get(psl.Product__c);
                    stockLevelToUpdate.add(sl);
                    
                    */
                }
                
            }
            
            system.debug(stockLevelMap);
            
            
            //Loop Stock Level Map for Update
            for(ID slId : stockLevelMap.keySet()){
                Stock_Level__c sl = new Stock_Level__c();
                sl.Id = slId;
                sl.Change_Quantity__c = stockLevelMap.get(slId);
                stockLevelToUpdate.add(sl);
                
            }
            
            if(stockLevelToUpdate.size() > 0){
                update stockLevelToUpdate;
            }
            
        }
        
        return;
    }
}