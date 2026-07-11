/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History 

*/
public without sharing class POSOnlineOrdersController {
    
    
    
    @auraEnabled
    public static List<Opportunity> getPendingOpportunity(string cashDrawerItemId, string cashierId){
        
        List<Opportunity> oppties = [SELECT Id, Name, Order_DateTime__c, CreatedDate, Order_Time__c, Customer__r.Name, Payment_Status__c, StageName, Amount, Cash_Drawer_Session__c FROM Opportunity WHERE 
                                     StageName = 'Pending Review'];
        if(oppties.size() > 0){
            return oppties;
        }else{
            return null;
        }
        
    }
    
    
    
}