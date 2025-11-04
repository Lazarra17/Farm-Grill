({
    doInit : function(component, event, helper) {
        
        helper.getProducts(component, event);
        helper.getProductCategories(component, event);
        
        
        
        console.log('cookie: ' + document.cookie);   
        
        var contactId = helper.getCookie('ContactId');
        if(contactId != ''){
            helper.getContact(component, event);
           
        }var accountId = helper.getCookie('AccountId');
        if(accountId != ''){
            helper.getExistingCustomers(component, accountId);
           
        }
     
        
        var username = helper.getCookie('username');
        if(username != null){
            component.set('v.username', username);
        }
       
    },
    
    /*
    selectProduct : function(component, event, helper) {
        var orderItem = component.get('v.orderItem');
        
        var buttonId = event.currentTarget.id;
        component.set("v.selectedProduct", buttonId);
        
        var pbe = event.currentTarget.dataset.pbe;
        var productId = event.currentTarget.dataset.productId;
        var productName = event.currentTarget.dataset.productName;
        var unitPrice = event.currentTarget.dataset.unitPrice;
        console.log(orderItem);
        
        orderItem = new Object();
        orderItem.Product2Id = productId;
        orderItem.UnitPrice = parseInt(unitPrice);
        orderItem.PricebookEntryId = pbe;
        orderItem.ProductName = productName;
        console.log('orderItem');
        console.log(JSON.stringify(orderItem));
        component.set('v.orderItem', orderItem);
        
        
    },
    
    addOne : function(component, event, helper) {
        var qty = component.get("v.qty");
        qty = qty + 1;
        component.set('v.qty', qty);
    },
    
    minusOne : function(component, event, helper) {
        var qty = component.get("v.qty");
        if(qty > 1){
            qty = qty - 1;
            component.set('v.qty', qty);
        }
        
    },
    
    

    
    addToCart : function(component, event, helper) {
        var orderItem = component.get('v.orderItem');
        var cashDrawer = component.get('v.cashDrawer');
        if(orderItem == null){
            component.set('v.error', 'No product selected.');
        }else if(cashDrawer == null){
            component.set('v.error', 'No active session found.');
        }else if(cashDrawer != null){
            if(cashDrawer.Status__c == 'Closed' || cashDrawer.Status__c == 'Reconciling'){
                component.set('v.error', 'No active session found.');
            }else{
                component.set('v.error', null);
                helper.processOrder(component, event);
            }
        }            
    },
    
    */
    
    handleApplicationEvent : function(component, event, helper) {
        
        
        
        var action = event.getParam("action");
        
        var employee = component.get('v.employee');
        
        console.log('EVENT ORDER:');
        console.log(action);
        
        if(action == 'deliveryOrder'){
            var opp = event.getParam("opportunity");
            
            component.set('v.opp', opp);
            var printModal = document.getElementById('printModal');
            $A.util.removeClass(printModal, 'slds-hide');
            helper.getCashDrawer(component, employee.Id);
            
        }else if(action == 'ordersComplete'){
            var cashDrawer = component.get('v.cashDrawer');
            var order = event.getParam("order");
            component.set('v.order', order);
            helper.getCashDrawer(component, employee.Id, employee.AccountId);
            
        }else if(action == 'ADD_ORDER_ITEM'){
            var orderItem = event.getParam("orderItem");
            component.set('v.orderItem', orderItem);
            
            helper.processOrder(component, event);
            
        }
        
        
        
    },
    
    calculateChange : function(component, event, helper) {
        var btnVal = event.currentTarget.value;
        var order = component.get('v.order');
        if(order == null){
            order = new Object();
        }
        
        if(order.PaymentReceived == null){
            order.PaymentReceived = btnVal;
        }else if(order.PaymentReceived.length <= 4){
            if((order.PaymentReceived.length == 4) && btnVal == '00'){
                btnVal = '0';
            }
            order.PaymentReceived = order.PaymentReceived + btnVal;
        }
        
        order.Change = parseInt(order.PaymentReceived) - order.Total;
        console.log(JSON.stringify(order));
        component.set('v.order', order);
        
    },
    
    inputReference : function(component, event, helper) {
        
        var btnVal = event.currentTarget.value;
        var order = component.get('v.order');
        if(order == null){
            order = new Object();
        }
      
        
        if(order.ReferenceNumber == null){
            order.ReferenceNumber = btnVal;
        }else if(order.ReferenceNumber.length <= 12){
            order.ReferenceNumber = order.ReferenceNumber + btnVal;
        }
        
        component.set('v.referenceNumberLength', order.ReferenceNumber.length);
        
        component.set('v.order', order);
        
    },
    
    
    
    clear : function(component, event, helper) {
      
        var order = component.get('v.order');
        order.PaymentReceived = '0';
        order.Change = 0;
        component.set('v.order', order);
        
    },
    
    clearInputReference : function(component, event, helper) {
        
        var order = component.get('v.order');
        order.ReferenceNumber = '';
        component.set('v.referenceNumberLength', order.ReferenceNumber.length);
        component.set('v.order', order);
        
    },
    
    
    
    completeOrder : function(component, event, helper) {
        var printModal = document.getElementById('printModal');
        $A.util.removeClass(printModal, 'slds-hide');
        helper.createOpportunity(component, event);
        
    },   
    
    setModeOfPayment : function(component, event, helper) {
        
        var selectedValue = event.target.value;
        console.log('SET MODE OF PAYMENT');
        console.log(selectedValue);
        component.set("v.modeOfPaymentSelected", selectedValue);
        
    }, 
    
  
    login : function(component, event, helper) {
        
        
        helper.signIn(component, event);
   
        
    },
    
    
    loginViaEnter : function(component, event, helper) {
        var keyPressed = event.key; // Get the character value
        // var physicalKey = event.code; // Get the physical key pressed
        if(keyPressed == 'Enter'){
            helper.signIn(component, event);
        }
        
        
    },
    
    
    
    
   
    
    startSession : function(component, event, helper) {
        
        helper.createSession(component, event);
    },
    
    endSession : function(component, event, helper) {
        var endSession = document.getElementById('cashDrawerItemModal');
        $A.util.removeClass(endSession, 'slds-hide');
        //helper.endSession(component, event);
    },
    
    showCustomerDetails : function(component, event, helper) {
        var deliveryModal = document.getElementById('deliveryModal');
        $A.util.removeClass(deliveryModal, 'slds-hide');
        //helper.endSession(component, event);
    },
    
    
    changeMOP : function(component, event, helper) {
        var selectedValue = event.getParam("value");
        if(selectedValue == 'Delivery'){
            component.set('v.modeOfPaymentSelected', 'COD');
        }else{
            component.set('v.modeOfPaymentSelected', 'Cash');
        }
        
        var order = component.get('v.order');
        order.ReferenceNumber = '';
        component.set('v.order', order);
        component.set('v.referenceNumberLength', 0);   //this is to hide the button
        
        
    },    
    
    
    
    amountTarget : function(component, event, helper) {
        var targetDiv = component.find('amount');
        var targetDiv2 = component.find('referenceNumber');
        $A.util.addClass(targetDiv, 'active');
        $A.util.removeClass(targetDiv2, 'active');
        component.set('v.isAmountCalcButtons', true);
    },
    
    refTarget : function(component, event, helper) {
        var targetDiv = component.find('amount');
        var targetDiv2 = component.find('referenceNumber');
        $A.util.removeClass(targetDiv, 'active');
        $A.util.addClass(targetDiv2, 'active');
        component.set('v.isAmountCalcButtons', false);
    },
    
    backspace : function(component, event, helper) {
        var order = component.get('v.order');
        
        
        if(order.ReferenceNumber != null){
            order.ReferenceNumber = order.ReferenceNumber.slice(0, -1);
        }
        component.set('v.referenceNumberLength', order.ReferenceNumber.length);
        
        component.set('v.order', order);
        
    },
    
    showVariety : function(component, event, helper) {
        var product = event.currentTarget.dataset.groupName;
        var productImg = event.currentTarget.dataset.productImg;
        
        component.set('v.selectedProduct', product);
        component.set('v.productImg', productImg);
        var varietyModal = document.getElementById('varietyModal');
        $A.util.removeClass(varietyModal, 'slds-hide');
        
        
    },
    
    
    
})