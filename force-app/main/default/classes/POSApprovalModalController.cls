public without sharing class POSApprovalModalController {
    
    @AuraEnabled
    public static POS_Setting__mdt getPosSettings(){
        
        POS_Setting__mdt settings = [SELECT Id, DeveloperName, Discount_Passcode__c, Account_Name__c FROM POS_Setting__mdt WHERE DeveloperName = 'Farm_Grill_Settings' LIMIT 1];
        
        
        return settings;
    }
    
    @AuraEnabled
    public static Contact createSrPwdRecord(Contact con){
        List<Contact> customers = [SELECT Id FROM Contact WHERE LastName =: con.LastName AND Sr_Citizen_Id__c =: con.Sr_Citizen_Id__c AND PWD_Id__c =: con.PWD_Id__c LIMIT 1];
        List<Account> farmGrillAcc = [SELECT Id FROM Account WHERE Name = 'Farm Grill'];
        con.AccountId = farmGrillAcc[0].Id;
        
        if(customers.size() > 0){
            con.Id = customers[0].Id;
            update con;
        }else{
            insert con;
        }
        
        
        return con;
    }
    
    
}