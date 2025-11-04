/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/
public without sharing class POSCashDrawerNewItemController {

    @auraEnabled
    public static Cash_Drawer_Item__c createCashDrawerItem(String cashDrawerId, String cashDrawerItem, String type){
        system.debug(cashDrawerItem);
        system.debug(cashDrawerId);
        Cash_Drawer_Item__c cdi = (Cash_Drawer_Item__c)  JSON.deserialize(cashDrawerItem, Cash_Drawer_Item__c.class);
        cdi.Type__c = type;
        cdi.Cash_Drawer_Session__c = cashDrawerId;
        system.debug(cdi);
        insert cdi;
        
        if(type == 'Ending Count'){
            Cash_Drawer_Session__c pos = POSMainController.endCashDrawer(cashDrawerId);
        }
        //return null if there is no account found
        return cdi;
    }
    
     
    @auraEnabled
    public static Cash_Drawer_Session__c endCashDrawer(String cashDrawerId){
        system.debug('cashDrawerId: ' + cashDrawerId);
        Cash_Drawer_Session__c cd = [SELECT Id, Contact__c, End_Date__c, End_Time__c FROM Cash_Drawer_Session__c WHERE Id =: cashDrawerId];
        
        DateTime gmtNow = System.now();
        Time localTime = gmtNow.time();
        
        cd.End_Date__c = system.today();
        cd.End_Time__c = localTime;
        cd.Status__c = 'Reconciling';
        update cd;
        
        //cd = getCashDrawer(cd.Contact__c);
        
        //return null if there is no account found
        return cd;
    }
    
}