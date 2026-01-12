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
    //public String ModeOfPayment;
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
            List<Contact> conList = [SELECT Id, AccountId, FirstName, Role__c, Manage_Inventory__c, Manage_Cash_Drawers__c  FROM Contact WHERE Username__c =: username AND Passcode__c =: passcode LIMIT 1];
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
            List<Contact> conList = [SELECT Id, AccountId, FirstName, Username__c, Passcode__c, Role__c,  Manage_Inventory__c, Manage_Cash_Drawers__c FROM Contact WHERE Id =: contactId LIMIT 1];
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
    public static Integer getPendingRemittances(String employeeId){
        
        Set<Id> opptySetId = new Set<Id>();
        for (OpportunityContactRole opptyRole : [SELECT Id, OpportunityId FROM OpportunityContactRole 
                                                 WHERE ContactId =: employeeId AND Opportunity.Payment_Status__c = 'Pending Remittance' AND Role = 'Cashier']){
                                                     
                                                     opptySetId.add(opptyRole.OpportunityId);
                                                     
                                                 }
             
        List<Opportunity> oppties = [SELECT Id, Name, Payment_Status__c, StageName, Amount, Cash_Drawer_Session__c FROM Opportunity WHERE 
                                     Id IN: opptySetId AND
                                     Payment_Status__c = 'Pending Remittance'];
        if(oppties.size() > 0){
            return oppties.size();
        }else{
            return 0;
        }
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
        }else if(mOP == 'COD' || mOP == 'COP'){
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
        }else if(payload.OrderType == 'Pickup'){
            opp.Name = 'PU-';
            opp.Payment_Status__c = 'Pending Remittance';
        }else{
            opp.Payment_Status__c = 'Paid';
        }
        opp.StageName = 'New';
        opp.CloseDate = system.today();
        opp.Type = payload.OrderType;
        opp.Cash_Tendered__c = payload.PaymentReceived;
        opp.Amount = payload.Total;
        opp.Queue_Number__c = queue;
        opp.Mode_of_Payment__c = mOP;
        opp.Cash_Drawer_Session__c = cashDrawerId;
        opp.Reference_Number__c = payload.ReferenceNumber;
        opp.Order_Time__c = system.now().time();
        opp.Customer__c = customer.Id;
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
                //get the basic price by diving the quantity
                opptyLine.UnitPrice = opptyLine.UnitPrice / opptyLine.Quantity;
                orderLines.add(opptyLine);
                
            }
            
        }
        
        if(orderLines.size() > 0){
            insert orderLines;
            updateStockLevel(orderLines);
            updateStockLevelOnBundled(orderLines);
        }
        
        
        //Create Cash Drawer Item
        List<Cash_Drawer_Item__c> cdItems = new List<Cash_Drawer_Item__c>();
        Cash_Drawer_Item__c cdi = new Cash_Drawer_Item__c();
        cdi.Cash_Drawer_Session__c = cashDrawerId;
        cdi.Type__c = cashDrawerMOP;
        cdi.Custom__c = payload.Total;
        cdi.Opportunity__c = opp.Id;
        cdi.customer__c = customer.Id;
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
    
    //Compare the Discount from Discount Record and return the discounted price to Site
    @auraEnabled
    public static List<PricebookEntry> getSrDiscount(String posParams){
        system.debug(posParams); 
        POSMainController payload = (POSMainController) JSON.deserialize(posParams, POSMainController.class);
        
        
        
        //Get Discounted Products
        Map<Id, Discount_Product__c> discountProdMap = new Map<Id, Discount_Product__c>();
        
        for(Discount_Product__c dp : [SELECT Id, Product__c, Discount__r.Name, Discount__r.Amount__c, Discount__r.Account__c, Discount__r.Calculation_Type__c,
                                      Discount__r.Start_Date_Time__c, Discount__r.Expiry_Date_Time__c
                                      FROM Discount_Product__c WHERE Discount__r.Name = 'SR/PWD Discount' ORDER BY Sort__c ASC]){
                                          
                                          //Check if discount is active
                                          Boolean active = false;
                                          if(dp.Discount__r.Start_Date_Time__c <= System.NOW() && dp.Discount__r.Expiry_Date_Time__c == null){
                                              active = true;
                                          }
                                          
                                          if(dp.Discount__r.Start_Date_Time__c <= system.NOW() && dp.Discount__r.Expiry_Date_Time__c >= system.Now()){
                                              active = true;
                                          }
                                          system.debug('active: ' + active);
                                          if(active){
                                              discountProdMap.put(dp.Product__c, dp);
                                          }else{
                                              
                                              try {
                                                  Map<String, String> errorMap = new Map<String, String>{
                                                      'code' => '400',
                                                          'message' => 'ERROR: ' + dp.Discount__r.Name + ' is expired.  Please ask for assitance!',
                                                          'severity' => 'High'
                                                          };
                                                              throw new AuraHandledException(JSON.serialize(errorMap));
                                                  
                                              } catch (Exception e) {
                                                  // If it's already an AuraHandledException, rethrow it
                                                  if(e instanceof AuraHandledException) throw e;
                                                  // Otherwise, wrap the system error
                                                  throw new AuraHandledException('System Error: ' + e.getMessage());
                                              }
                                          }
                                          
                                          
                                      }
        system.debug('discountProdMap: ' + discountProdMap);
        Map<Id, PricebookEntry> pbeMap = new Map<Id, PricebookEntry>();
        List<PricebookEntry> discountedItems = new List<PricebookEntry>();
        
        for(PricebookEntry pbe : [SELECT Id, Product2Id, Product2.Display_Name__c, Product2.Name, UnitPrice FROM PricebookEntry 
                                                WHERE Product2ID IN : discountProdMap.KeySet() AND PriceBook2.Name = 'Standard Price Book']){
            
            pbeMap.put(pbe.Product2Id, pbe);
            /*
            if(discountProdMap.containsKey(pbe.Product2Id)){
                pbe.UnitPrice = pbe.UnitPrice - discountProdMap.get(pbe.Product2Id).Discount__r.Amount__c * pbe.UnitPrice;
                
            }
                                                    */
            
        }
        
        
        for(String dpmId : discountProdMap.KeySet()){
            if(pbeMap.containsKey(dpmId)){
                pbeMap.get(dpmId).UnitPrice = pbeMap.get(dpmId).UnitPrice - (discountProdMap.get(dpmId).Discount__r.Amount__c * pbeMap.get(dpmId).UnitPrice);
       			discountedItems.add(pbeMap.get(dpmId));
                
            }
            
        }
        
        return discountedItems;
        
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
        
        
        //Select Mode of Payment for Cash Drawer Item
        if(mOP == 'Cash'){
            cashDrawerMOP = 'Sales'; 
        }else if(mOP == 'Gcash'){
            cashDrawerMOP = 'Sales Gcash'; 
        }else if(mOP == 'COD' || mOP == 'COP'){
            cashDrawerMOP = 'Pending Remittance'; 
        }
        
        
        Contact customer = new Contact(); 
        List<Contact> conList = [SELECT Id, LastName, FirstName, MobilePhone, Complete_Address__c
                                 FROM Contact WHERE AccountId =: payload.AccountId AND MobilePhone =: payload.Customer.MobilePhone
                                 AND FirstName =: payload.Customer.FirstName AND LastName =: payload.Customer.LastName LIMIT 1];
        if(conList.size() > 0){
            customer = conList[0];
            customer.LastName = payload.Customer.LastName;
            customer.FirstName = payload.Customer.FirstName;
            customer.MobilePhone = payload.Customer.MobilePhone;
            if(payload.Customer.Complete_Address__c != ''){
                customer.Complete_Address__c = payload.Customer.Complete_Address__c;
            }
            
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
        
        opp.Cash_Tendered__c = payload.PaymentReceived;
        opp.Amount = payload.Total;
        opp.Queue_Number__c = queue;
        opp.Reference_Number__c = payload.ReferenceNumber;
        opp.Cash_Drawer_Session__c = cashDrawerId;
        opp.Notes__c = payload.Notes;
        opp.Mode_of_Payment__c = mOP;
        opp.Order_Time__c = system.now().time();
        opp.Customer__c = customer.Id;
        
        if(payload.OrderType == 'Delivery'){
            opp.Type = 'Delivery';
        }else if(payload.OrderType == 'Pickup'){
            opp.Type = 'Pickup';
        }
        
        if(mOP == 'COD' || mOP == 'COP'){
            
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
        if(payload?.RiderId != '' && payload?.RiderId != null){
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
                //get the basic price by diving the quantity
                opptyLine.UnitPrice = opptyLine.UnitPrice / opptyLine.Quantity;
                
                //opptyLine.UnitPrice = pbeMap.get(opptyLine.PricebookEntryId).UnitPrice;
                orderLines.add(opptyLine);
                
            }
            
        }
        
        if(orderLines.size() > 0){
            insert orderLines;
            
            updateStockLevel(orderLines);
            updateStockLevelOnBundled(orderLines);
            
        }
        
      
        
       
        
        Opportunity oppToUpdate = [SELECT Id, Name, Opportunity_Number__c FROM Opportunity WHERE Id =: opp.Id]; 
        oppToUpdate.Name = oppToUpdate.Name	 + oppToUpdate.Opportunity_Number__c;
        
        if(mOP == 'COD'){
            
            oppToUpdate.StageName = 'Out for Delivery';
        }else if(mOP == 'COP'){
            
            oppToUpdate.StageName = 'For Pickup';
        }else{ 
            oppToUpdate.StageName = 'Closed Won';
            
            
            //Create Cash Drawer Item
            List<Cash_Drawer_Item__c> cdItems = new List<Cash_Drawer_Item__c>();
            
            Cash_Drawer_Item__c cdi = new Cash_Drawer_Item__c();
            cdi.Cash_Drawer_Session__c = cashDrawerId;
            cdi.Type__c = cashDrawerMOP;
            cdi.Custom__c =  payload.Total;
            cdi.Opportunity__c = opp.Id;
            cdi.customer__c = customer.Id;
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
        List<Product_Catalog_Item__c> products = [SELECT Id, Category__c, Product__r.Sub_Family__c, Product__r.Display_Name__c, Product__c, Product_Group__c, Product_Group__r.Name, Product_Group__r.Product_Image_Url__c, Product__r.ProductCode, Product__r.Name, Product__r.Product_Image_Url__c FROM Product_Catalog_Item__c 
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
    
    @AuraEnabled
    public static Map<String, List<String>> getModeOfPayments() {
        Map<String, List<String>>  picklistValues = new Map<String, List<String>> ();
        
        for(POS_Mode_of_Payment__mdt mop : [SELECT Id, Order_Type__c, Mode_of_Payment_Options__c FROM POS_Mode_of_Payment__mdt]){
            picklistValues.put(mop.Order_Type__c, mop.Mode_of_Payment_Options__c.split(',')); 
        }
        
      
        return picklistValues;
    }
    
    
    
    public static void updateStockLevel(List<OpportunityLineItem> opptyProducts) {
        Set<Id> prodStockLevelIds = new Set<Id>();
        Set<Id> prodBunldeIds = new Set<Id>();
       
        
        for(OpportunityLineItem oppLine : [SELECT Id, Product2.Track_Inventory__c, Product2Id, Product2.Parent_Product__c, Product2.Bundled__c FROM OpportunityLineItem WHERE Id IN : opptyProducts 
                                           AND Product2.Track_Inventory__c = TRUE AND Product2.Bundled__c = FALSE]){
                                               
                                               if(oppLine.Product2.Parent_Product__c != null){
                                                   prodStockLevelIds.add(oppLine.Product2.Parent_Product__c);
                                               }else{
                                                   prodStockLevelIds.add(oppLine.Product2Id);
                                               }
                                               
                                           }
        
   
        //Get the Stock Level records in Map
        Map<Id, Stock_Level__c> stockLevelMap = new Map<Id, Stock_Level__c>(); 
        for(Stock_Level__c sl : [SELECT Id, Product__c, Product__r.Name, Change_Quantity__c, Available_to_Sell__c FROM Stock_Level__c WHERE Product__c IN : prodStockLevelIds]){
            stockLevelMap.put(sl.Product__c, sl);
        }
        
        system.debug('stockLevelMap: ' + stockLevelMap);
        
        if(stockLevelMap.size() > 0){
            
            Map<Id, Decimal> stockLevelVsQuantity = new Map<Id, Decimal>();
            
            for(OpportunityLineItem oppLine : [SELECT Id, Product2Id, Quantity, Product2.Parent_Product__c FROM OpportunityLineItem WHERE Id IN : opptyProducts 
                                               AND Product2.Track_Inventory__c = TRUE AND Product2.Bundled__c = FALSE]){
                                                   
                                                   if(stockLevelVsQuantity.containsKey(oppLine.Product2Id)){
                                                       
                                                       Decimal totalQuantity = stockLevelVsQuantity.get(oppLine.Product2Id) + oppLine.Quantity;
                                                       stockLevelVsQuantity.put(oppLine.Product2Id, totalQuantity); 
                                                       
                                                   }else{
                                                       stockLevelVsQuantity.put(oppLine.Product2Id, oppLine.Quantity); 
                                                       
                                                   }
                                                   
                                                   if(stockLevelVsQuantity.containsKey(oppLine.Product2.Parent_Product__c)){
                                                       
                                                       Decimal totalQuantity = stockLevelVsQuantity.get(oppLine.Product2.Parent_Product__c) + oppLine.Quantity;
                                                       stockLevelVsQuantity.put(oppLine.Product2.Parent_Product__c, totalQuantity); 
                                                       
                                                   }else{
                                                       
                                                       stockLevelVsQuantity.put(oppLine.Product2.Parent_Product__c, oppLine.Quantity); 
                                                       
                                                   }
                                                   
                                                   
                                                   
                                               }
            
            system.debug('stockLevelVsQuantity: ' + stockLevelVsQuantity);
            
            List<Stock_Level__c> stockLevelToUpdate = new List<Stock_Level__c>();
            if(stockLevelVsQuantity.size() > 0){
                
                for(Stock_Level__c sl : stockLevelMap.values()){
                    
                    if(stockLevelVsQuantity.containsKey(sl.Product__c)){
                        
                        //Check if there is still stock available
                        if((sl.Available_to_Sell__c + -stockLevelVsQuantity.get(sl.Product__c)) < 0){
                            
                            try {
                                Map<String, String> errorMap = new Map<String, String>{
                                    	'code' => '400',
                                        'message' => 'ERROR: ' + sl.Product__r.Name + ' is Out of Stock.  Please ask for assitance!',
                                        'severity' => 'High'
                                        };
                                            throw new AuraHandledException(JSON.serialize(errorMap));
                                
                            } catch (Exception e) {
                                // If it's already an AuraHandledException, rethrow it
                                if(e instanceof AuraHandledException) throw e;
                                // Otherwise, wrap the system error
                                throw new AuraHandledException('System Error: ' + e.getMessage());
                            }
                            
                        }else{
                            
                            //Negative Values as it is a minus stock
                            sl.Change_Quantity__c = -stockLevelVsQuantity.get(sl.Product__c);      
                            stockLevelToUpdate.add(sl);
                        }
                        
                        
                    }
                   
                }
                
                system.debug('stockLevelToUpdate: ' + stockLevelToUpdate);
				update stockLevelToUpdate;
                
            }
            
            
        }
        
        
    }
    
    
    
    public static void updateStockLevelOnBundled(List<OpportunityLineItem> opptyProducts) {
        Set<Id> prodStockLevelIds = new Set<Id>();
        Set<Id> prodBunldeIds = new Set<Id>();
       
        
        for(OpportunityLineItem oppLine : [SELECT Id, Product2.Track_Inventory__c, Product2Id, Product2.Parent_Product__c, Product2.Bundled__c FROM OpportunityLineItem WHERE Id IN : opptyProducts 
                                           AND Product2.Track_Inventory__c = TRUE AND Product2.Bundled__c = TRUE]){
                                               
                                                   prodBunldeIds.add(oppLine.Product2Id);
                                           
                                               
                                           }
        
        Map<Id, List<Bundle_Component__c>> bundleComponentMap = new Map<Id, List<Bundle_Component__c>>();
        for(Bundle_Component__c component : [SELECT Id, Component_Product__c, Quantity__c, Bundled_Product__c FROM Bundle_Component__c WHERE Bundled_Product__c =: prodBunldeIds]){
            prodStockLevelIds.add(component.Component_Product__c);
            
            if(bundleComponentMap.containsKey(component.Bundled_Product__c)){
                bundleComponentMap.get(component.Bundled_Product__c).add(component);
            }else{
                bundleComponentMap.put(component.Bundled_Product__c, new List<Bundle_Component__c>{component});
            }
            
        }
        
        //Get the Stock Level records in Map
        Map<Id, Stock_Level__c> stockLevelMap = new Map<Id, Stock_Level__c>(); 
        for(Stock_Level__c sl : [SELECT Id, Product__c, Change_Quantity__c, Available_to_Sell__c, Product__r.Name FROM Stock_Level__c WHERE Product__c IN : prodStockLevelIds]){
            stockLevelMap.put(sl.Product__c, sl);
        }
        
        system.debug('stockLevelMap: ' + stockLevelMap);
        
        if(stockLevelMap.size() > 0){
            
            Map<Id, Decimal> stockLevelVsQuantity = new Map<Id, Decimal>();
            List<Stock_Level__c> stockLevelToUpdate = new List<Stock_Level__c>();
            
            for(OpportunityLineItem oppLine : [SELECT Id, Product2Id, Quantity, Product2.Parent_Product__c FROM OpportunityLineItem WHERE Id IN : opptyProducts 
                                               AND Product2.Track_Inventory__c = TRUE AND Product2.Bundled__c = TRUE]){
                                                   
                                           			
                                                   //Compare the Bundle Component and Oppty Product to get the total of quantity
                                                   if(bundleComponentMap.containsKey(oppLine.Product2Id)){
                                                       
                                                       for(Bundle_Component__c cb : BundleComponentMap.get(oppLine.Product2Id)){
                                                           
                                                           if(stockLevelMap.containsKey(cb.Component_Product__c)){
                                                               
                                                               Decimal qtySubTotal = cb.Quantity__c * oppLine.Quantity;
                                                               
                                                               if(stockLevelMap.get(cb.Component_Product__c).Change_Quantity__c != null){
                                                                   
                                                                   stockLevelMap.get(cb.Component_Product__c).Change_Quantity__c = stockLevelMap.get(cb.Component_Product__c).Change_Quantity__c + qtySubTotal;
                                                               }else{
                                                                
                                                                   stockLevelMap.get(cb.Component_Product__c).Change_Quantity__c = qtySubTotal;
                                                               }
                                                               
                                                           }
                                                           
                                                       }
                                                       
                                                       
                                                   }
                                                   
                                                   
                                               }
            
            
            
            for(Stock_Level__c sl : stockLevelMap.values()){
                
                //Check if there is still stock available
                if((sl.Available_to_Sell__c + -sl.Change_Quantity__c) < 0){
                    
                    try {
                        Map<String, String> errorMap = new Map<String, String>{
                            'code' => '400',
                                'message' => 'ERROR: ' + sl.Product__r.Name + ' is Out of Stock.  Please ask for assitance!',
                                'severity' => 'High'
                                };
                                    throw new AuraHandledException(JSON.serialize(errorMap));
                        
                    } catch (Exception e) {
                        // If it's already an AuraHandledException, rethrow it
                        if(e instanceof AuraHandledException) throw e;
                        // Otherwise, wrap the system error
                        throw new AuraHandledException('System Error: ' + e.getMessage());
                    }
                    
                }else{
                    
                    //Negative Values as it is a minus stock
                    sl.Change_Quantity__c = -sl.Change_Quantity__c;
                    stockLevelToUpdate.add(sl);
                }
                
                
                
                
                
                
            }
            
            system.debug('stockLevelToUpdate: ' + stockLevelToUpdate);
            
            if(stockLevelToUpdate.size() > 0){
				update stockLevelToUpdate;
                
            }
            
            
        }
        
        
    }
    
    

}