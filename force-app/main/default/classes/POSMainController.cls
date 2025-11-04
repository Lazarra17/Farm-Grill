/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/  
public without sharing class POSMainController {
    
    public List<OpportunityLineItem> orderItems;
    public Decimal Total;
    public Decimal PaymentReceived;
    public String OrderType;
    public String ModeOfPayment;
    public String AccountId;
    public String ContactId;
    public String ReferenceNumber;
    public Contact Customer;
    public Integer PendingRemittance;
    public String RiderId;
    public String CashierId;
    public String Notes;
    
    
    @auraEnabled
    public static Contact signIn(String username, String passcode){
        
        if(username != '' && passcode != ''){
            List<Contact> conList = [SELECT Id, AccountId, FirstName, Role__c FROM Contact WHERE Username__c =: username AND Passcode__c =: passcode LIMIT 1];
            if(conList.size() > 0){
                return conList[0];
            }else{
                return null;
            }
            
        }
        //return null if there is no account found
        return null;
    }
    
    @auraEnabled
    public static Contact getContact(String contactId){
        
        if(contactId != ''){
            List<Contact> conList = [SELECT Id, AccountId, FirstName, Username__c, Passcode__c, Role__c FROM Contact WHERE Id =: contactId LIMIT 1];
            if(conList.size() > 0){
                return conList[0];
            }else{
                return null;
            }
            
        }
        //return null if there is no account found
        return null;
    }
    
    @auraEnabled
    public static Integer getPendingRemittances(String cashDrawerId){
        Integer count = 0;
        if(cashDrawerId != ''){
            count = [SELECT Id FROM Opportunity WHERE Cash_Drawer_Session__c = :cashDrawerId AND Payment_Status__c = 'Pending Remittance'].size();
                
                }
    
        return count;
    }
    
    @auraEnabled
    public static List<Contact> getExistingCustomers(String accountId){
        
        
        List<Contact> conList = [SELECT Id, AccountId, FirstName, LastName, Name, MobilePhone, Complete_Address__c FROM Contact 
                                 WHERE AccountId =: accountId AND Role__c = 'Customer' AND Name != 'Walk-in Customer'
                                 ORDER BY Name ASC];
        if(conList.size() > 0){
            return conList;
        }else{
            return null;
        }
        
        
    }
    
    
    @auraEnabled
    public static POS_Setting__mdt getPosSettings(String accountName){
        POS_Setting__mdt posSettings = new POS_Setting__mdt();
        if(accountName != ''){
            return POS_Setting__mdt.getInstance('Farm_Grill_Settings');
        }else{
            return null;
        }
        
    }
    
    
    
    @auraEnabled
    public static Cash_Drawer_Session__c getCashDrawer(String employeeId, String accountId){
        
        Cash_Drawer_Session__c cd = new Cash_Drawer_Session__c();
        List<Cash_Drawer_Session__c> activeCashDrawer = [SELECT Id, Status__c, Total_Sales_Cash__c, Total_Count_Orders__c,Total_Sales_Gcash__c, TECH_Start_Time__c, Start_Date__c,
                                                         Expected_Count__c, End_Date__c, Number_of_Pending_Remittances__c	
                                                         FROM Cash_Drawer_Session__c WHERE Contact__c =: employeeId AND Account__c =: accountId ORDER BY CreatedDate DESC LIMIT 1];
        if(activeCashDrawer.size() > 0){
            cd = activeCashDrawer[0];
            
        }else{
            return null;
        }
        
        //return null if there is no account found
        return cd;
    }
    
    @auraEnabled
    public static Cash_Drawer_Session__c checkCashDrawer(String cashDrawerId){
        
        Cash_Drawer_Session__c cd = new Cash_Drawer_Session__c();
        List<Cash_Drawer_Session__c> activeCashDrawer = [SELECT Id, Status__c FROM Cash_Drawer_Session__c WHERE Id =: cashDrawerId LIMIT 1];
        if(activeCashDrawer.size() > 0){
            cd = activeCashDrawer[0];
            
        }else{
            return null;
        }
        
        //return null if there is no account found
        return cd;
    }
    
    
    @auraEnabled
    public static Contact updatePasscode(String contactId, String passcode){
        
        Contact con = [SELECT Id, Passcode__c FROM Contact WHERE Id =: contactId];
        con.Passcode__c = passcode;
        update con;
        
        return con;
    }
    
    
    
    @auraEnabled
    public static Cash_Drawer_Session__c createCashDrawer(String employeeId, String accountId){
        
        Cash_Drawer_Session__c cd = new Cash_Drawer_Session__c();
        
        DateTime gmtNow = System.now();
        Time localTime = gmtNow.time();
        
        //Create Cash Drawer Session
        cd.Status__c = 'Open';
        cd.Start_Date__c = system.today();
        cd.Start_Time__c = localTime;
        cd.Account__c = accountId;
        cd.Contact__c = employeeId;
        insert cd;
        
        cd = getCashDrawer(employeeId, accountId);
        
        //return null if there is no account found
        return cd;
    }
    
    @auraEnabled
    public static Cash_Drawer_Session__c endCashDrawer(String cashDrawerId){
        
        Cash_Drawer_Session__c cd = [SELECT Id, Contact__c, End_Date__c, End_Time__c FROM Cash_Drawer_Session__c WHERE Id =: cashDrawerId];
        
        DateTime gmtNow = System.now();
        Time localTime = gmtNow.time();
     
        cd.End_Date__c = system.today();
        cd.End_Time__c = localTime;
        cd.Status__c = 'Reconciling';
        update cd;
        
       // cd = getCashDrawer(cd.Contact__c, accountId);
        
        //return null if there is no account found
        return cd;
    }


    @auraEnabled
    public static Opportunity createOpportunity(String posParams, String cashDrawerId, String mOP){
        system.debug(posParams);
        Integer queue = 1;
        POSMainController payload = (POSMainController) JSON.deserialize(posParams, POSMainController.class);
        
        Map<Id, PriceBookEntry> pbeMap = new Map<Id, PriceBookEntry>();
        Set<Id> pbEntrySet = new Set<Id>();
        String cashDrawerMOP = '';
        //Get the latest Queue number and add 1
        List<Opportunity> latestQueue = [SELECT Id, Queue_Number__c  FROM Opportunity WHERE CreatedDate = TODAY AND Queue_Number__c != null ORDER BY Queue_Number__c DESC LIMIT 1];
        if(latestQueue.size() > 0){
            queue = Integer.valueOf(latestQueue[0].Queue_Number__c) + 1;
        }
        
        Contact customer = new Contact();
        List<Contact> conList = [SELECT Id FROM Contact WHERE AccountId =: payload.AccountId AND Name = 'Walk-in Customer' LIMIT 1];
        if(conList.size() > 0){
            customer = conList[0];
        }else{
            customer.LastName = 'Walk-in Customer';
            customer.AccountId = payload.AccountId;
            customer.Role__c = 'Customer';
            insert customer;
        }
        
        //Select Mode of Payment for Cash Drawer Item
        if(mOP == 'Cash'){
            cashDrawerMOP = 'Sales'; 
        }else if(mOP == 'Gcash'){
            cashDrawerMOP = 'Sales Gcash'; 
        }else if(mOP == 'COD'){
            cashDrawerMOP = 'Pending Remittance'; 
        }
        
        
        Opportunity opp = new Opportunity();
        opp.AccountId = payload.AccountId;
        
        if(payload.OrderType == 'Dine-in'){
            opp.Name = 'DI-';
        }else if(payload.OrderType == 'Take Out'){
            opp.Name = 'TO-';
        }else if(payload.OrderType == 'Delivery'){
            opp.Name = 'DE-';
        }
        opp.StageName = 'New';
        opp.CloseDate = system.today();
        opp.Type = payload.OrderType;
        opp.Cash_Tendered__c = payload.PaymentReceived;
        opp.Amount = payload.Total;
        opp.Queue_Number__c = queue;
        opp.Mode_of_Payment__c = payload.ModeOfPayment;
        opp.Cash_Drawer_Session__c = cashDrawerId;
        opp.Reference_Number__c = payload.ReferenceNumber;
        opp.Payment_Status__c = 'Paid';
        opp.ContactId = payload.ContactId;
        insert opp;
        
        //Create Opportunity Contact Roles for customer
        List<OpportunityContactRole> opptyRoles = new List<OpportunityContactRole>();
        OpportunityContactRole customerRole = new OpportunityContactRole();
        customerRole.OpportunityId = opp.Id;
        customerRole.ContactId = customer.Id;
        customerRole.Role = 'Walk-in Customer';
        opptyRoles.add(customerRole);
        
        //Create Opportunity Contact Roles for cashier
        OpportunityContactRole cashierRole = new OpportunityContactRole();
        cashierRole.OpportunityId = opp.Id;
        cashierRole.ContactId = payload.ContactId;
        cashierRole.Role = 'Cashier';
        opptyRoles.add(cashierRole);
        
        if(opptyRoles.size() > 0){
            insert opptyRoles;
        }
        
        
        for(OpportunityLineItem opptyLine : payload.orderItems){
           pbEntrySet.add(opptyLine.PricebookEntryId);
        }
        
        //Loop PriceBookEntry from DB to avoid XSS
        for(PriceBookEntry pbe : [SELECT Id, UnitPrice, Product2Id FROM PriceBookEntry WHERE Id IN : pbEntrySet]){
            pbeMap.put(pbe.Id, pbe);
        }
        
        //Map the Unit Price from CRM DB
        List<OpportunityLineItem> orderLines = new List<OpportunityLineItem>();
        for(OpportunityLineItem opptyLine : payload.orderItems){
            
            if(pbeMap.containsKey(opptyLine.PricebookEntryId)){
                opptyLine.OpportunityId = opp.Id;
                opptyLine.UnitPrice = pbeMap.get(opptyLine.PricebookEntryId).UnitPrice;
                orderLines.add(opptyLine);
                
            }
            
        }
        
        if(orderLines.size() > 0){
            insert orderLines;
        }
        
        
        //Create Cash Drawer Item
        List<Cash_Drawer_Item__c> cdItems = new List<Cash_Drawer_Item__c>();
        Cash_Drawer_Item__c cdi = new Cash_Drawer_Item__c();
        cdi.Cash_Drawer_Session__c = cashDrawerId;
        cdi.Type__c = cashDrawerMOP;
        cdi.Custom__c = payload.Total;
        cdi.Opportunity__c = opp.Id;
        cdi.Reference_Number__c = payload.ReferenceNumber;
        cdItems.add(cdi);
        
        
        
        if(cdItems.size() > 0){
            insert cdItems;
        }
        
        
        Opportunity oppToUpdate = [SELECT Id, Name, Opportunity_Number__c FROM Opportunity WHERE Id =: opp.Id]; 
        oppToUpdate.Name = oppToUpdate.Name	 + oppToUpdate.Opportunity_Number__c;
        if(payload.OrderType != 'Delivery'){
            oppToUpdate.StageName = 'Closed - Won';
        }else{
            oppToUpdate.StageName = 'Out for Delivery';
        }
        
        update oppToUpdate;
        return oppToUpdate;
        
    }
    
    
    @auraEnabled
    public static Opportunity createDeliveryOpportunity(String posParams, String cashDrawerId, String mOP){
        system.debug(posParams);
        Integer queue = 1;
        POSMainController payload = (POSMainController) JSON.deserialize(posParams, POSMainController.class);
        system.debug('Customer: ' + payload.Customer);
        Map<Id, PriceBookEntry> pbeMap = new Map<Id, PriceBookEntry>();
        Set<Id> pbEntrySet = new Set<Id>();
        String cashDrawerMOP = '';
        //Get the latest Queue number and add 1
        List<Opportunity> latestQueue = [SELECT Id, Queue_Number__c  FROM Opportunity WHERE CreatedDate = TODAY AND Queue_Number__c != null ORDER BY Queue_Number__c DESC LIMIT 1];
        if(latestQueue.size() > 0){
            queue = Integer.valueOf(latestQueue[0].Queue_Number__c) + 1;
        }
        
        Contact customer = new Contact(); 
        List<Contact> conList = [SELECT Id, LastName, FirstName, MobilePhone, Complete_Address__c
                                 FROM Contact WHERE AccountId =: payload.AccountId AND MobilePhone =: payload.Customer.MobilePhone LIMIT 1];
        if(conList.size() > 0){
            customer = conList[0];
            customer.LastName = payload.Customer.LastName;
            customer.FirstName = payload.Customer.FirstName;
            customer.MobilePhone = payload.Customer.MobilePhone;
            customer.Complete_Address__c = payload.Customer.Complete_Address__c;
            update customer;
        }else{
            customer.LastName = payload.Customer.LastName;
            customer.FirstName = payload.Customer.FirstName;
            customer.MobilePhone = payload.Customer.MobilePhone;
            customer.Complete_Address__c = payload.Customer.Complete_Address__c;
            customer.AccountId = payload.AccountId;
            customer.Role__c = 'Customer';
            insert customer;
        }
        
        Opportunity opp = new Opportunity();
        opp.AccountId = payload.AccountId;
        
        
        opp.Name = 'DE-';        
        opp.StageName = 'New';
        opp.CloseDate = system.today();
        opp.Type = 'Delivery';
        opp.Cash_Tendered__c = payload.PaymentReceived;
        opp.Amount = payload.Total;
        opp.Queue_Number__c = queue;
     
        
        opp.Reference_Number__c = payload.ReferenceNumber;
        opp.Cash_Drawer_Session__c = cashDrawerId;
        
        opp.Notes__c = payload.Notes;
      
        opp.Mode_of_Payment__c = payload.ModeOfPayment;
        if(payload.ModeOfPayment == 'COD'){
            
            opp.Payment_Status__c = 'Pending Remittance';
        }else{ 
            opp.Payment_Status__c = 'Paid';
        }
        
        
        
        
        
        insert opp;
        
        //Create Opportunity Contact Roles for customer
        List<OpportunityContactRole> opptyRoles = new List<OpportunityContactRole>();
        system.debug('payload.customer: ' + customer);
        system.debug('payload.RiderId: ' + payload.RiderId);
        system.debug('payload.CashierId: ' + payload.CashierId);
        system.debug('payload.ContactId: ' + payload.ContactId);
        
        
        if(customer != null){
            OpportunityContactRole customerRole = new OpportunityContactRole();
            customerRole.OpportunityId = opp.Id;
            customerRole.ContactId = customer.Id;
            customerRole.Role = 'Online Customer';
            opptyRoles.add(customerRole);
        }
        
        
               
        //Create Opportunity Contact Roles for Delivery Rider
        if(payload?.RiderId != ''){
            OpportunityContactRole riderRole = new OpportunityContactRole();
            riderRole.OpportunityId = opp.Id;
            riderRole.ContactId = payload.RiderId;
            riderRole.Role = 'Delivery Rider';
            opptyRoles.add(riderRole);
        }
        
        
        //This condition is for CSR Only
        if(payload?.CashierId != '' && payload?.CashierId != null){
            //Create Opportunity Contact Roles for Customer Service Representative
            OpportunityContactRole CSRRole = new OpportunityContactRole();
            CSRRole.OpportunityId = opp.Id;
            CSRRole.ContactId = payload.ContactId;
            CSRRole.Role = 'Customer Service Representative';
            opptyRoles.add(CSRRole);
            
            
            //Create Opportunity Contact Roles for cashier
            OpportunityContactRole cashierRole = new OpportunityContactRole();
            cashierRole.OpportunityId = opp.Id;
            cashierRole.ContactId = payload.CashierId;
            cashierRole.Role = 'Cashier';
            opptyRoles.add(cashierRole);
            
            
        }else if(payload?.ContactId != ''){
            //Create Opportunity Contact Roles for cashier
            OpportunityContactRole cashierRole = new OpportunityContactRole();
            cashierRole.OpportunityId = opp.Id;
            cashierRole.ContactId = payload.ContactId;
            cashierRole.Role = 'Cashier';
            opptyRoles.add(cashierRole);
        }
        
        
        
        
        
        
        
        
        if(opptyRoles.size() > 0){
            insert opptyRoles;
        }
        
        
        for(OpportunityLineItem opptyLine : payload.orderItems){
           pbEntrySet.add(opptyLine.PricebookEntryId);
        }
        
        //Loop PriceBookEntry from DB to avoid XSS
        for(PriceBookEntry pbe : [SELECT Id, UnitPrice, Product2Id FROM PriceBookEntry WHERE Id IN : pbEntrySet]){
            pbeMap.put(pbe.Id, pbe);
        }
        
        //Map the Unit Price from CRM DB
        List<OpportunityLineItem> orderLines = new List<OpportunityLineItem>();
        for(OpportunityLineItem opptyLine : payload.orderItems){
            
            if(pbeMap.containsKey(opptyLine.PricebookEntryId)){
                opptyLine.OpportunityId = opp.Id;
                opptyLine.UnitPrice = pbeMap.get(opptyLine.PricebookEntryId).UnitPrice;
                orderLines.add(opptyLine);
                
            }
            
        }
        
        if(orderLines.size() > 0){
            insert orderLines;
        }
        
        //Select Mode of Payment for Cash Drawer Item
        if(mOP == 'Cash'){
            cashDrawerMOP = 'Sales'; 
        }else if(mOP == 'Gcash'){
            cashDrawerMOP = 'Sales Gcash'; 
        }else if(mOP == 'COD'){
            cashDrawerMOP = 'Pending Remittance'; 
        }
        
       
        
        Opportunity oppToUpdate = [SELECT Id, Name, Opportunity_Number__c FROM Opportunity WHERE Id =: opp.Id]; 
        oppToUpdate.Name = oppToUpdate.Name	 + oppToUpdate.Opportunity_Number__c;
        
        if(payload.ModeOfPayment == 'COD'){
            
            oppToUpdate.StageName = 'Out for Delivery';
        }else{ 
            oppToUpdate.StageName = 'Closed Won - Delivered';
            
            
            //Create Cash Drawer Item
            List<Cash_Drawer_Item__c> cdItems = new List<Cash_Drawer_Item__c>();
                
                Cash_Drawer_Item__c cdi = new Cash_Drawer_Item__c();
                cdi.Cash_Drawer_Session__c = cashDrawerId;
                cdi.Type__c = cashDrawerMOP;
                cdi.Custom__c = cdi.Custom__c = payload.Total;
                cdi.Opportunity__c = opp.Id;
                cdi.Reference_Number__c = payload.ReferenceNumber;
                cdItems.add(cdi);
      
            
            
            if(cdItems.size() > 0){
                insert cdItems;
            }
            
            
            
        }
        
        
        
        
        
        update oppToUpdate;
        return oppToUpdate;
        
    }
    
    @AuraEnabled
    public static Map<String, List<Product_Catalog_Item__c>> getProducts(){
        
		Map<String, List<Product_Catalog_Item__c>> prodMap = new Map<String, List<Product_Catalog_Item__c>>();
        List<Product_Catalog_Item__c> products = [SELECT Id, Category__c, Product__r.Sub_Family__c, Product__c, Product_Group__c, Product_Group__r.Name, Product_Group__r.Product_Image_Url__c, Product__r.ProductCode, Product__r.Name, Product__r.Product_Image_Url__c FROM Product_Catalog_Item__c 
                                              WHERE Product_Catalog__r.Active__c = TRUE ORDER BY Priority__c ASC, Row_Priority__c ASC, Product__r.Sub_Family__c ASC];
        
        Map<String, PriceBookEntry> sPriceBookEntryMap = new Map<String, PriceBookEntry>();
        for(PriceBookEntry pb : [SELECT Id, Product2Id, UnitPrice FROM PriceBookEntry WHERE PriceBook2.Name = 'Standard Price Book']){
            sPriceBookEntryMap.put(pb.Product2Id, pb);
        }
        
        for(Product_Catalog_Item__c pc : products){
           
            if(sPriceBookEntryMap.containsKey(pc.Product__c)){
                pc.TECH_PriceBookEntryId__c = sPriceBookEntryMap.get(pc.Product__c).Id;
                pc.TECH_Unit_Price__c = sPriceBookEntryMap.get(pc.Product__c).UnitPrice;
            }
            if(prodMap.containsKey(pc.Product_Group__r.Name)){
                prodMap.get(pc.Product_Group__r.Name).add(pc);
            }else{
                prodMap.put(pc.Product_Group__r.Name, new List<Product_Catalog_Item__c>{pc});
            }
            
            
        }
        
        return prodMap;
    }
    
    @AuraEnabled
    public static Map<String, List<Product_Group__c>> getProductCategories(){
        
        Map<String, List<Product_Group__c>> prodMap = new Map<String, List<Product_Group__c>>();
        List<Product_Catalog_Item__c> products = [SELECT Id, Category__c, Product_Group__c, Product_Group__r.Name, Product_Group__r.Product_Image_Url__c,  Product__c, Product__r.ProductCode, Product__r.Name, Product__r.Product_Image_Url__c FROM Product_Catalog_Item__c 
                                              WHERE Product_Catalog__r.Active__c = TRUE ORDER BY Priority__c ASC, Row_Priority__c ASC];
        
      
        
        Map<Id, Product_Group__c> prodGroupMap = new Map<Id, Product_Group__c>();
        Set<Id> prodGroupIds = new Set<Id>();
        
        for(Product_Catalog_Item__c pc : products){
        	prodGroupIds.add(pc.Product_Group__c);
            
        }
        
        
        for(Product_Group__c prodGroup : [SELECT Id, Name, Product_Image_Url__c FROM Product_Group__c WHERE ID IN: prodGroupIds]){
            prodGroupMap.put(prodGroup.Id, prodGroup);
        }
        
        
        for(Product_Catalog_Item__c pc : products){
            
            
            if(prodMap.containsKey(pc.Category__c)){
                
                if(!prodMap.get(pc.Category__c).contains(prodGroupMap.get(pc.Product_Group__c))){
                    prodMap.get(pc.Category__c).add(prodGroupMap.get(pc.Product_Group__c));
                }
                
            }else{
                prodMap.put(pc.Category__c, new List<Product_Group__c>{prodGroupMap.get(pc.Product_Group__c)});
            }
            
        }
        
        return prodMap;
    }
    
    
    @AuraEnabled
    public static Map<String, String> getPicklistValues(String objectName, String fieldName) {
        Map<String, String>  picklistValues = new Map<String, String> ();
        // Example for Account.Industry
        // Replace with your desired objectName and fieldName
        Schema.SObjectField field = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(fieldName);
        if (field != null) {
            for (Schema.PicklistEntry entry : field.getDescribe().getPicklistValues()) {
                picklistValues.put(entry.getLabel(), entry.getValue()); // Or entry.getValue() for API names
            }
        }
        return picklistValues;
    }
    
    @AuraEnabled
    public static Map<String, String> getRiders(String accountId) {
        Map<String, String>  picklistValues = new Map<String, String> ();
        // Example for Account.Industry
        // Replace with your desired objectName and fieldName
        // 
        for(Contact con : [SELECT Id, Name FROM Contact WHERE Role__c = 'Delivery Rider' AND AccountId =: accountId]){
             picklistValues.put(con.Name, con.Id); 
        }
      
        return picklistValues;
    }
    
    
    @AuraEnabled
    public static Map<String, String> getCashiers(String accountId) {
        Map<String, String>  picklistValues = new Map<String, String> ();
        // Example for Account.Industry
        // Replace with your desired objectName and fieldName
        // 
        for(Contact con : [SELECT Id, Name FROM Contact WHERE Role__c = 'Cashier' AND AccountId =: accountId]){
             picklistValues.put(con.Name, con.Id); 
        }
      
        return picklistValues;
    }

}