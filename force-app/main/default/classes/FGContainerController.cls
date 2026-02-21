/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/  
public without sharing class FGContainerController {
    
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
    public static Map<String, List<Product_Catalog_Item__c>> getProducts(){
        
        Resto_Site_Setting__mdt fgSetting = getSiteSettings('Farm_Grill_Settings');
        
        Map<String, List<Product_Catalog_Item__c>> prodMap = new Map<String, List<Product_Catalog_Item__c>>();
        List<Product_Catalog_Item__c> products = [SELECT Id, Category__c, Product__r.Sub_Family__c, Popular__c, Product__r.Display_Name__c, Product__r.Resto_Site_Display_Name__c, Product__r.Description,
                                                  Product__c, Product_Group__c, Product_Group__r.Name, Product_Group__r.Product_Image_Url__c, Product__r.ProductCode, Product__r.Name, 
                                                  Product__r.Product_Image_Url__c 
                                                  FROM Product_Catalog_Item__c 
                                                  WHERE Product_Catalog__r.Active__c = TRUE AND Product_Catalog__r.Name =: fgSetting.Catalog__c AND Category__c != 'Delivery'  ORDER BY Priority__c ASC, Row_Priority__c ASC];
        
        Map<String, PriceBookEntry> sPriceBookEntryMap = new Map<String, PriceBookEntry>();
        for(PriceBookEntry pb : [SELECT Id, Product2Id, UnitPrice FROM PriceBookEntry WHERE PriceBook2.Name = 'Standard Price Book']){
            sPriceBookEntryMap.put(pb.Product2Id, pb);
        }
        
        for(Product_Catalog_Item__c pc : products){
        
            
            if(sPriceBookEntryMap.containsKey(pc.Product__c)){
                pc.TECH_PriceBookEntryId__c = sPriceBookEntryMap.get(pc.Product__c).Id;
                pc.TECH_Unit_Price__c = sPriceBookEntryMap.get(pc.Product__c).UnitPrice;
            }
            if(prodMap.containsKey(pc.Category__c)){
                prodMap.get(pc.Category__c).add(pc);
            }else{
                prodMap.put(pc.Category__c, new List<Product_Catalog_Item__c>{pc});
            }
            
          
            
        }
        
        return prodMap;
    }
    
    
    @AuraEnabled
    public static Map<String, Decimal> getCart(String leadId) {
        AggregateResult[] groupedResults = [SELECT SUM(Quantity__c) sumQty, 
                                            SUM(Total_Price__c) sumTotalPrice 
                                            FROM Lead_Line_Item__c WHERE Lead__c =: leadId];
        
        Map<String, Decimal> resultMap = new Map<String, Decimal>();
        if (groupedResults.size() > 0) {
            
            if(groupedResults[0].get('sumQty') != null){
                resultMap.put('totalQty', (Decimal)groupedResults[0].get('sumQty'));
                resultMap.put('totalPrice', (Decimal)groupedResults[0].get('sumTotalPrice'));
            }else{
                resultMap.put('totalQty',0);
                resultMap.put('totalPrice', 0);
            }
            
        }
        return resultMap;
    }
    
    
    

}