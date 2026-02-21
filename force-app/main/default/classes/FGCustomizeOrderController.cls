/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/  
public without sharing class FGCustomizeOrderController {
    
    
    @auraEnabled
    public static Resto_Site_Setting__mdt getSiteSettings(String settingName){
        Resto_Site_Setting__mdt posSettings = new Resto_Site_Setting__mdt();
        if(settingName != ''){
            return Resto_Site_Setting__mdt.getInstance(settingName);
        }else{
            return null;
        }
        
    }
    
    
    @AuraEnabled
    public static PriceBookEntry getProductDetail(String recordId){
        
        
        return [SELECT Id, UnitPrice, Product2Id, Product2.Name, Product2.Product_Image_Url__c, Product2.Description, Product2.Family
                FROM PriceBookEntry WHERE Product2Id =: recordId];
        
        
    }
    
    
    @AuraEnabled
    public static List<Product_Catalog_Item__c> getProductsByCategory(String category){
        
        Resto_Site_Setting__mdt fGrillSettings = getSiteSettings('Farm_Grill_Settings');
        
        Set<Id> prodIds = new Set<Id>(); 
        Set<Id> trackedProdIds = new Set<Id>(); 
        Map<Id, PricebookEntry> pbEntryMap = new Map<Id, PricebookEntry>();
        List<PriceBookEntry> productsToDisplay = new List<PriceBookEntry>();
        
        List<Product_Catalog_Item__c> catalogItems = [SELECT Id, Product__c, Product__r.Name, Product__r.Track_Inventory__c, Row_Priority__c, Category__c, TECH_InStock__c FROM Product_Catalog_Item__c 
                                                      WHERE Category__c =: category AND Product_Catalog__r.Name =: fGrillSettings.Catalog__c AND Display_in_Website__c = true
                                                      ORDER BY Row_Priority__c ASC];
        for(Product_Catalog_Item__c ci : catalogItems){
            prodIds.add(ci.Product__c);
            
            if(ci.Product__r.Track_Inventory__c){
                trackedProdIds.add(ci.Product__c);
            }
        }
        
        for(PriceBookEntry pbEntry : [SELECT Id, UnitPrice, Product2Id, Product2.Name, Product2.Product_Image_Url__c, Product2.Description, Product2.Family
                                      FROM PriceBookEntry WHERE Product2Id IN : prodIds]){
                                          
                                          pbEntryMap.put(pbEntry.Product2Id, pbEntry);
                                          
                                      }
        
        
        //Check stock level
        Map<Id,Stock_Level__c> stockLevelProdMap = new Map<Id,Stock_Level__c>();
        for(Stock_Level__c sl : [SELECT Id, Product__c, Available_to_Sell__c FROM Stock_Level__c WHERE Product__c IN : trackedProdIds]){
            stockLevelProdMap.put(sl.Product__c, sl);
        }
        
        
        for(Product_Catalog_Item__c ci : catalogItems){
            
            if(pbEntryMap.containsKey(ci.Product__c)){
                //productsToDisplay.add(pbEntryMap.get(ci.Product__c));
                ci.TECH_PriceBookEntryId__c = pbEntryMap.get(ci.Product__c).Id;
                ci.TECH_Unit_Price__c = pbEntryMap.get(ci.Product__c).UnitPrice;
            }
            
            //Check Stock if track inventory is true then check stock, otherwise true
            if(stockLevelProdMap.containsKey(ci.Product__c)){
                if(stockLevelProdMap.get(ci.Product__c).Available_to_Sell__c > 0){
                    ci.TECH_InStock__c = true;
                }
            }else{
                ci.TECH_InStock__c = true;  //always true if track inventory is false on product level
            }
            
            
        }
         
        return catalogItems;
        
        
    }
    
    
    @AuraEnabled
    public static Lead createLead(PriceBookEntry product, Integer quantity, List<String> beverages, List<String> desserts, String notes, String ipAddress){
        List<String> addOns = new List<String>();
        
        Lead l = new Lead();
        l.LastName = 'Online Customer';
        l.Company = 'Farm Grill';
        l.IP_Address__c = ipAddress;
        
        insert l;
        
        //Create Main Order
        List<Lead_Line_Item__c> leadItems = new List<Lead_Line_Item__c>();
        Lead_Line_Item__c item = new Lead_Line_Item__c();
        item.Lead__c = l.Id;
        item.Product__c = product.Product2Id;
        item.Unit_Price__c = product.UnitPrice;
        item.TECH_PricebookEntry__c = product.Id;
        item.Quantity__c = quantity;
        item.Special_Notes__c = notes;
        item.TECH_MainProduct__c = true;
        leadItems.add(item);
        
        
        if(beverages.size() > 0){
            addOns.addAll(beverages);
        }
        
        if(desserts.size() > 0){
            addOns.addAll(desserts);
        }
        
        if(addOns.size() > 0){
            for(PriceBookEntry pbItem : [SELECT Id, UnitPrice, Product2Id FROM PriceBookEntry WHERE Id IN : addOns AND PriceBook2.Name = 'Standard Price Book']){
                
                Lead_Line_Item__c addOn = new Lead_Line_Item__c();
                addOn.Lead__c = l.Id;
                addOn.Product__c = pbItem.Product2Id;
                addOn.Unit_Price__c = pbItem.UnitPrice;
                addOn.TECH_PricebookEntry__c = pbItem.Id;
                addOn.Quantity__c = quantity;
                leadItems.add(addOn);
                
            }
            
            if(leadItems.size() > 0){
                insert leadItems;
                
            }
        }
        
        
        
        return l;
        
        
    }
    
    @AuraEnabled
    public static String updateLead(String leadId, PriceBookEntry product, Integer quantity, List<String> beverages, List<String> desserts, String notes, String ipAddress){
        
        List<String> addOns = new List<String>();
        List<Lead_Line_Item__c> leadItems = new List<Lead_Line_Item__c>();
        
        if(beverages.size() > 0){
            addOns.addAll(beverages);
        }
        
        if(desserts.size() > 0){
            addOns.addAll(desserts);
        }
        
        
        
        Map<Id, Lead_Line_Item__c> leadItemsMap = new Map<Id, Lead_Line_Item__c>();
        
        
        for(Lead_Line_Item__c li : [SELECT Id, Quantity__c, Product__c FROM Lead_Line_Item__c WHERE Lead__c =: leadId]){
            leadItemsMap.put(li.Product__c, li);
        }
        
        
        //Create Main Order
        Lead_Line_Item__c mainItem = new Lead_Line_Item__c();
        if(leadItemsMap.containsKey(product.Product2Id)){
            //If found update the main product
            mainItem = leadItemsMap.get(product.Product2Id);
            mainItem.Quantity__c = leadItemsMap.get(product.Product2Id).Quantity__c + quantity;
            mainItem.TECH_MainProduct__c = true;
            leadItems.add(mainItem);
            
        }else{
            //create a new one
            
            mainItem.Lead__c = leadId;
            mainItem.Product__c = product.Product2Id;
            mainItem.Unit_Price__c = product.UnitPrice;
            mainItem.TECH_PricebookEntry__c = product.Id;
            mainItem.Quantity__c = quantity;
            mainItem.Special_Notes__c = notes;
            mainItem.TECH_MainProduct__c = true;
            leadItems.add(mainItem);
        }
        
        if(addOns.size() > 0){
            
            
            for(PriceBookEntry pbItem : [SELECT Id, UnitPrice, Product2Id FROM PriceBookEntry WHERE Id IN : addOns AND PriceBook2.Name = 'Standard Price Book']){
                
                Lead_Line_Item__c addOn = new Lead_Line_Item__c(); 
                
                if(leadItemsMap.containsKey(pbItem.Product2Id)){
                    addOn = leadItemsMap.get(pbItem.Product2Id);
                    addOn.Quantity__c = addOn.Quantity__c + quantity;
                    leadItems.add(addOn);
                    
                }else{
                    
                    addOn.Lead__c = leadId;
                    addOn.Product__c = pbItem.Product2Id;
                    addOn.Unit_Price__c = pbItem.UnitPrice;
                    addOn.TECH_PricebookEntry__c = pbItem.Id;
                    addOn.Quantity__c = quantity;
                    leadItems.add(addOn);
                    
                }
                
                
                
            }
            
            
            

            
            
            
            
            
        }
        
        if(leadItems.size() > 0){
            upsert leadItems;
            
        }
        
        return leadId;
        
        
    }
    
}