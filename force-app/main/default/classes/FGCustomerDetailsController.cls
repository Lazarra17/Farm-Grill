/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public without sharing class FGCustomerDetailsController {
    
    @AuraEnabled
    public static List<String> getPicklistValues(String objectName, String fieldName) {
        List<String> options = new List<String>();
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        
        List<Schema.PicklistEntry> values = fieldMap.get(fieldName).getDescribe().getPickListValues();
        
        for (Schema.PicklistEntry entry : values) {
            options.add(entry.getLabel());
        }
        return options;
    }
    
    @AuraEnabled
    public static Lead getLead(String leadId){
        
        Lead l = [SELECT Id, FirstName, LastName, MobilePhone, Municipality_City__c, Barangay_Sitio__c, Complete_Address__c, TECH_LastName__c, Company FROM Lead WHERE Id =: leadId];
        
        return l;
    }
    
    @AuraEnabled
    public static List<Lead_Line_Item__c> getLeadItems(String leadId){
        
        List<Lead_Line_Item__c> lineItems = [SELECT Id, TECH_MainProduct__c, Product__c, Product__r.Name,Product__r.Product_Image_Url__c, Quantity__c, Total_Price__c, Product__r.Resto_Site_Display_Name__c 
                                             FROM Lead_Line_Item__c WHERE Lead__c =: leadId ORDER BY TECH_MainProduct__c DESC];
        
        return lineItems; 
    }
    
    @AuraEnabled
    public static Lead updateLead(Lead lead){
        
        lead.LastName = lead.TECH_LastName__c;
        lead.LeadSource = 'Web';
        lead.Mode_of_Payment__c = 'COD';
        lead.Municipality_City__c = 'Dolores';
        update lead;
        
        return lead; 
    }
    
    @AuraEnabled
    public static Lead_Line_Item__c addDelivery(String leadId, String barangay){
        
        Map<String, Delivery_Fee_Setting__mdt> feeSettingsMap = Delivery_Fee_Setting__mdt.getAll();
        List<Delivery_Fee_Setting__mdt> feeSettingsList = feeSettingsMap.values();
        Map<String, Decimal> deliveryFeeMap = new Map<String, Decimal>();
        
        for(Delivery_Fee_Setting__mdt df : feeSettingsList){
            deliveryFeeMap.put(df.Barangay_Sitio__c, df.Delivery_Fee__c);
        }
        
        //Check if there is already a delivery line item
         Lead_Line_Item__c lineItem = new Lead_Line_Item__c();
        if(deliveryFeeMap.containsKey(barangay)){
            
            
           
            List<Lead_Line_Item__c> deliveryItem = [SELECT Id, Unit_Price__c FROM Lead_Line_Item__c WHERE Lead__c =: leadId AND Product__r.Name = 'Delivery Fee' LIMIT 1];
            if(deliveryItem.size() > 0){
                lineItem = deliveryItem[0];
                lineItem.Unit_Price__c = deliveryFeeMap.get(barangay);
            }else{
                PriceBookEntry deliveryProd = [SELECT Id, Product2Id, UnitPrice FROM PriceBookEntry WHERE Product2.Name = 'Delivery Fee' LIMIT 1];
                
                lineItem.Product__c = deliveryProd.Product2Id;
                lineItem.Unit_Price__c = deliveryFeeMap.get(barangay);
                lineItem.Quantity__c = 1;
                lineItem.TECH_PricebookEntry__c = deliveryProd.Id;
                lineItem.Lead__c = leadId;
            }
            
            upsert lineItem;
        }
        
        
        //update Lead
        Lead l = [SELECT Id, Barangay_Sitio__c FROM Lead WHERE Id=: leadId];
        l.Barangay_Sitio__c = barangay;
        update l;
        
        
        system.debug('LEAD ITEM: ' + l);
        return lineItem; 
    }
    
    
    @AuraEnabled
    public static Lead placeOrder(Lead lead){
        
        List<Account> acc = [SELECT Id FROM Account WHERE Name =: lead.Company LIMIT 1];
        if(acc.size() > 0){
            
            List<Contact> contacts = [SELECT Id, FirstName, LastName, MobilePhone, Complete_Address__c, Municipality_City__c, Barangay_Sitio__c FROM Contact WHERE MobilePhone =: lead.MobilePhone];
            Contact con = new Contact();
            if(contacts.size() > 0){
                con = contacts[0];
                con.FirstName = lead.FirstName;
                con.LastName = lead.LastName;
                con.MobilePhone = lead.MobilePhone;
                con.Complete_Address__c = lead.Complete_Address__c;
                con.Municipality_City__c = lead.Municipality_City__c;
                con.Barangay_Sitio__c = lead.Barangay_Sitio__c;
                
                update con;
            }else{
                con.FirstName = lead.FirstName;
                con.LastName = lead.LastName;
                con.MobilePhone = lead.MobilePhone;
                con.Complete_Address__c = lead.Complete_Address__c;
                con.Municipality_City__c = lead.Municipality_City__c;
                con.Barangay_Sitio__c = lead.Barangay_Sitio__c;
                con.AccountId = acc[0].Id;
                insert con;
            }
            
            
            //Create Opportunity
            Opportunity opp = new Opportunity();
            opp.Name = 'DE-';
            opp.StageName = 'Pending Review';
            opp.CloseDate = System.today();
            opp.AccountId = acc[0].Id;
            opp.Customer__c = con.Id;
            opp.Mobile_Number__c = lead.MobilePhone;
            opp.Complete_Address__c = lead.Complete_Address__c;
            opp.Mode_of_Payment__c = lead.Mode_of_Payment__c;
            opp.Type = 'Delivery';
            opp.Lead__c = lead.Id;
            opp.Order_Time__c = system.now().time();
            insert opp;
            
            opp = [SELECT Id, Name, Opportunity_Number__c FROM Opportunity WHERE Id =: opp.Id];
            opp.Name = opp.Name + opp.Opportunity_Number__c;
            update opp; 
            
            //create opportunity contact role
            OpportunityContactRole contactRole = new OpportunityContactRole();
            contactRole.ContactId = con.Id;
            contactRole.Role = 'Online Customer';
            contactRole.IsPrimary = true;
            contactRole.OpportunityId = opp.Id;
            insert contactRole;
            
            //Create Opportunity Line Item
            List<OpportunityLineItem> opptyLineItems = new List<OpportunityLineItem>();
            for(Lead_Line_Item__c li : [SELECT Id, Product__c, TECH_MainProduct__c, Product__r.Name, Product__r.Resto_Site_Display_Name__c, Quantity__c, Total_Price__c, Unit_Price__c, Special_Notes__c, TECH_PricebookEntry__c
                                        FROM Lead_Line_Item__c WHERE Lead__c =: lead.Id ]){
                                            
                                            
                                            OpportunityLineItem oppLine = new OpportunityLineItem();
                                            oppLine.OpportunityId = opp.Id;
                                            oppLine.Product2Id = li.Product__c;
                                            oppLine.Quantity = li.Quantity__c;
                                            oppLine.UnitPrice = li.Unit_Price__c;
                                            oppLine.POS_Display_Name__c = li.Product__r.Resto_Site_Display_Name__c;
                                            oppLine.Special_Notes__c = li.Special_Notes__c;
                                            oppLine.PricebookEntryId = li.TECH_PricebookEntry__c;
                                            oppLine.TECH_MainProduct__c = li.TECH_MainProduct__c;
                                            opptyLineItems.add(oppLine);
                                            
                                            
                                        }
            
            if(opptyLineItems.size() > 0){
                insert opptyLineItems;
                system.debug('LEADId: ' + lead.Id);
                //Delete items in the cart
                List<Lead_Line_Item__c> llis = [SELECT Id FROM Lead_Line_Item__c WHERE Lead__c =: lead.Id];
                delete llis;
            }
            
        }
        
        
        
        
        
        return lead; 
    }
    
}