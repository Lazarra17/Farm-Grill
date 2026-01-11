public without sharing class POSDiscountedProductsModalController {
    
    
    @AuraEnabled
    public static List<PricebookEntry> getDiscountableProducts(String order){
        
        List<PricebookEntry> prods = [SELECT Id, Product2.Name FROM PriceBookEntry];
        
        return prods;
    }
    
    
}