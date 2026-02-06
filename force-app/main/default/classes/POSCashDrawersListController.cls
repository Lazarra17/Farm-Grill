/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History 

*/
public without sharing class POSCashDrawersListController {
    
     
    @auraEnabled
    public static List<Cash_Drawer_Session__c> getCashDrawers(String accountId){
        
        Cash_Drawer_Session__c cd = new Cash_Drawer_Session__c();
        List<Cash_Drawer_Session__c> activeCashDrawers = [SELECT Id, Name, Status__c, Account__c, Start_Date__c, Contact__c, Contact__r.Name, Contact__r.Manage_Cash_Drawers__c,
                                                         Expected_Count__c, Ending_Count__c, Difference__c	
                                                         FROM Cash_Drawer_Session__c WHERE Account__c =: accountId AND Status__c != 'Closed' 
                                                          AND Contact__r.FirstName != 'Chad' 
                                                          AND Contact__r.FirstName != 'Charina' ORDER BY CreatedDate];
      
        
        //return null if there is no account found
        return activeCashDrawers;
    }
    
    @auraEnabled
    public static Contact getContact(String contactId){
        
        Contact con = [SELECT Id, Name, Manage_Cash_Drawers__c FROM Contact WHERE Id =: contactId];
      
        
        //return null if there is no account found
        return con;
    }
    
    
    @auraEnabled
    public static List<Cash_Drawer_Session__c> updateCashDrawer(String cashdrawerJSON, String status, String note){
        
        Cash_Drawer_Session__c cd = (Cash_Drawer_Session__c) JSON.deserialize(cashdrawerJSON, Cash_Drawer_Session__c.class);
        system.debug(cd);
        cd.Status__c = status;
        cd.Notes__c = note;
        update cd;
        
        return getCashDrawers(cd.Account__c);
    }
    
    

}