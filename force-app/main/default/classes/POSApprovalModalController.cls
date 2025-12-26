public class POSApprovalModalController {
    
    @AuraEnabled
    public static POS_Setting__mdt getPosSettings(){
        
        POS_Setting__mdt settings = [SELECT Id, DeveloperName, Discount_Passcode__c, Account_Name__c FROM POS_Setting__mdt WHERE DeveloperName = 'Farm_Grill_Settings' LIMIT 1];
        
        
        return settings;
    }
    
}