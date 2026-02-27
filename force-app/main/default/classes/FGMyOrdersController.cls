/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc: 
@History
 
*/ 
public without sharing class FGMyOrdersController {
    
    public class MyOrders{
        @AuraEnabled
        public Opportunity oppty;
        @AuraEnabled
        public List<OpportunityLineItem> opptyLines;
    }
    
    
    @AuraEnabled
    public static List<MyOrders> getOrders(String leadId){
        List<MyOrders> myOdrs = new List<MyOrders>();
      
        Set<Id> opptyIdset = new Set<Id>();
        
        for(Opportunity opp : [SELECT Id, Name, StageName, Order_Time__c FROM Opportunity WHERE Lead__c =: leadId]){
            opptyIdset.add(opp.Id);
        }
        
        if(opptyIdset.size() > 0){
            
            List<OpportunityLineItem> opptyLinesList = new List<OpportunityLineItem>();
            Map<Id, List<OpportunityLineItem>> opptyLinesMap = new Map<Id, List<OpportunityLineItem>>();
            for(OpportunityLineItem oppLine : [SELECT Id, OpportunityId, Product2.Name, Product2.Resto_Site_Display_Name__c, Product2.Product_Image_Url__c, TotalPrice, Quantity  
                                               FROM OpportunityLineItem WHERE OpportunityId IN : opptyIdset ORDER BY TECH_MainProduct__c DESC]){
                                                   
                                                   if(opptyLinesMap.containsKey(oppLine.OpportunityId)){
                                                       opptyLinesMap.get(oppLine.OpportunityId).add(oppLine);
                                                   }else{
                                                       opptyLinesMap.put(oppLine.OpportunityId, new List<OpportunityLineItem>{oppLine});
                                                       
                                                   }
                                                   
                                               }
            
            
            if(opptyLinesMap.size() > 0){
                for(Opportunity opp : [SELECT Id, Name, StageName, Order_Time__c, CloseDate, Amount FROM Opportunity WHERE Lead__c =: leadId]){
                    
                    if(opptyLinesMap.containsKey(opp.Id)){
                        MyOrders myOdr = new MyOrders();
                        myOdr.oppty = opp;
                        myOdr.opptyLines = opptyLinesMap.get(opp.Id);
                        myOdrs.add(myOdr);
                    }
                    
                }
            }
            
            
        }
        
        system.debug(myOdrs);
      
        return myOdrs; 
    }
    
    
    @AuraEnabled
    public static Opportunity cancelOrder(String opptyId){
        Opportunity oppty = [SELECT Id, StageName FROM Opportunity WHERE Id=: opptyId];
        if(oppty.StageName == 'Pending Review'){
            delete oppty;
            return null;
        }else{
            return oppty;
        }
    }
    
    
    
    
    
}