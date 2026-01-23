({
    getProducts : function(component, event) {
        
        var action = component.get("c.getProducts");    
        action.setParams({       
            
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                
                var products = [];
                for(var key in res){
                    products.push({value:res[key], key:key});
                }
                
                component.set("v.products", products);
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    
    getProductCategories : function(component, event) {
        
        var action = component.get("c.getProductCategories");    
        action.setParams({       
            
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                
                var products = [];
                for(var key in res){
                    products.push({value:res[key], key:key});
                }
                
                component.set("v.productCategories", products);
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    
    getExistingCustomers : function(component, accountId) {
        
        var action = component.get("c.getExistingCustomers");  
        action.setParams({       
            accountId : accountId,
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                
                component.set('v.existingCustomers', res);
            
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log('getExisitncusto');
                    console.log("Error: " + errors[0].message);
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },

    
    getOrderType : function(component, event) {
        var employee = component.get('v.employee');
        var action = component.get("c.getPicklistValues");    
        action.setParams({       
            objectName : 'Opportunity',
            fieldName : 'Type'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                var picklistObj = [];
                
                
                for(var key in res){
                    if(key == 'Dine-in' && employee.Role__c != 'Customer Service Representative'){
                        component.set('v.orderTypeOptionSelected', res[key]);
                        
                    }else if(key == 'Delivery' && employee.Role__c == 'Customer Service Representative'){
                        component.set('v.orderTypeOptionSelected', res[key]);
                    }
                    
                    if(employee.Role__c == 'Customer Service Representative'){
                        if(key == 'Delivery'){
                            picklistObj.push({value:res[key], label:key});
                        } else  if(key == 'Pickup'){
                            picklistObj.push({value:res[key], label:key});
                        } 
                        
                    }else{
                        picklistObj.push({value:res[key], label:key});
                    }
                   
                }
                component.set("v.orderTypeOptions", picklistObj);
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
         
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
            
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    getRiders : function(component, event) {
       
     	var employee = component.get('v.employee');
        var action = component.get("c.getRiders");    
        action.setParams({       
            accountId : employee.AccountId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                var picklistObj = [];
                
                for(var key in res){
                    picklistObj.push({value:res[key], label:key});
                }
                component.set('v.riderOptions', picklistObj);
                               
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    
    getCashiers : function(component, event) {
       
     	var employee = component.get('v.employee');
        var action = component.get("c.getCashiers");    
        action.setParams({       
            accountId : employee.AccountId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                var picklistObj = [];
                
                for(var key in res){
                    picklistObj.push({value:res[key], label:key});
                }
                component.set('v.cashierOptions', picklistObj);
                               
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    
    getModeOfPayment : function(component, event) {
        var employee = component.get("v.employee");   
        var action = component.get("c.getModeOfPayments");    
        action.setParams({       
        
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();      
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                var picklistObj = [];
                
                
                for(var key in res){
                    
                    picklistObj.push({value:res[key], label:key});
                     
                }
                component.set("v.modeOfPaymentOptions", picklistObj);
                
                
                if(employee.Role__c == 'Customer Service Representative'){
                    component.set('v.modeOfPaymentSelected', 'COD');
                }
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
         
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
            
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    
    getPosSettings : function(component, event) {
        
        var action = component.get("c.getPosSettings");    
        action.setParams({       
            getPosSettings : 'Farm Grill'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
             
                component.set("v.posSettings", res);
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
         
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
            
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    createOpportunity : function(component, event) {
        var order = component.get('v.order');
        var employee = component.get('v.order');
        var cashDrawer = component.get('v.cashDrawer');
        var action = component.get("c.createOpportunity");  
        var modeOfPayment = component.get('v.modeOfPaymentSelected');
        component.set('v.showSpinner', true);  //Show loading

        console.log('modeOfPayment: ' + modeOfPayment);
        action.setParams({       
            posParams : JSON.stringify(order),
            cashDrawerId : cashDrawer.Id,
            mOP : modeOfPayment
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            console.log('state: ' + state);
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                component.set('v.opp', res);
                component.set('v.error', '');
                
                var appEvent = $A.get("e.c:POSAppEvent");
                appEvent.setParams({"action": "COMPLETE_ORDER"});
                appEvent.fire();
                
                
                var printModal = document.getElementById('printModal');
                $A.util.removeClass(printModal, 'slds-hide');
                
                
                //Print Customer Receipt
                this.printReceipt(
                    '/s/receipt-customer?recordId=' + res.Id
                );
                
              
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    const errorObj = JSON.parse(errors[0].message);
                    console.log(errorObj.message);
                    component.set('v.error', errorObj.message);
                    // Show error message
                }  
            
            component.set('v.showSpinner', false);  //Show loading
       
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    
    
    getContact : function(component, event) {
        var contactId = this.getCookie('ContactId');
        var action = component.get("c.getContact");   
        component.set('v.showSpinner', true);  //Show loading
        action.setParams({       
            contactId : contactId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                if(res != null){
                    component.set('v.employee', res);
                    this.setCookie("username", res.Username__c);
                    this.setCookie("FirstName", res.FirstName);
                    this.setCookie("ContactId", res.Id);
                    this.setCookie("AccountId", res.AccountId);
                    this.setCookie("Manage_Inventory__c", res.Manage_Inventory__c);
                    this.setCookie("Manage_Cash_Drawers__c", res.Manage_Cash_Drawers__c);
                    this.setCookie("Manage_Employees__c", res.Manage_Employees__c);
                    this.setCookie("Enable_POS__c", res.Enable_POS__c);
                    
                    
                }else{
                    this.setCookie("FirstName", "");
                    this.setCookie("ContactId", "");
                    this.setCookie("AccountId", "");
                    this.setCookie("Manage_Inventory__c", "");
                    this.setCookie("Manage_Cash_Drawers__c", "");
                    this.setCookie("Manage_Employees__c", "");
                    this.setCookie("Enable_POS__c", "");
                }
                
               
                this.getOrderType(component, event);
                this.getModeOfPayment(component, event);
                this.getCashDrawer(component, res.Id, res.AccountId);
                
                 
                this.getRiders(component, event);
                this.getCashiers(component, event);
                
                
                if(!res.Enable_POS__c){
                    var profileLink = '/profile?recordId=' + res.Id;
                    this.gotoURL(component, event, profileLink);
                }
            
                var appEvent = $A.get("e.c:POSAppEvent");
                appEvent.setParams({"employee": res});
                appEvent.fire();
                
                
                
            
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    
                    // Show error message
                }    
            
            component.set('v.showSpinner', false);  //Show loading
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    signIn : function(component, event) {
        var username = component.get('v.username');
        var passcode = component.get('v.passcode');
        var action = component.get("c.signIn");   
        component.set('v.showSpinner', true);  //Show loading
        action.setParams({       
            username : username,
            passcode : passcode,
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
              
                var res = response.getReturnValue();
                if(res != null){
                    component.set('v.employee', res);
                    this.setCookie("username", username);
                    this.setCookie("FirstName", res.FirstName);
                    this.setCookie("ContactId", res.Id);
                    this.setCookie("AccountId", res.AccountId);
                    this.setCookie("Manage_Inventory__c", res.Manage_Inventory__c);
                    this.setCookie("Manage_Cash_Drawers__c", res.Manage_Cash_Drawers__c);
                    this.setCookie("Manage_Employees__c", res.Manage_Employees__c);
                    this.setCookie("Enable_POS__c",res.Enable_POS__c);
                    this.getModeOfPayment(component, event);
                    this.getOrderType(component, event);
                    this.getExistingCustomers(component, res.AccountId);
                 	this.getRiders(component, event);
                    this.getCashiers(component, event);
                    this.getCashDrawer(component, res.Id, res.AccountId);
                    
                    var appEvent = $A.get("e.c:POSAppEvent");
                    appEvent.setParams({"employee": res});
                    appEvent.fire();
                    
                    if(!res.Enable_POS__c){
                        var profileLink = '/profile?recordId=' + res.Id;
                        this.gotoURL(component, event, profileLink);
                    }
                    
                  
                    
                    
                }else{
                    this.setCookie("FirstName", "");
                    this.setCookie("ContactId", "");
                    this.setCookie("AccountId", "");
                    this.setCookie("Manage_Inventory__c", "");
                    this.setCookie("Manage_Cash_Drawers__c", "");
                    this.setCookie("Manage_Employees__c", "");
                    this.setCookie("Enable_POS__c", "");
                    component.set('v.error', 'Incorrect username and passcode.');
                }
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    
                    // Show error message
                }    
            
            component.set('v.showSpinner', false);  //Show loading
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    getCashDrawer : function(component, employeeId, accountId) {
        var action = component.get("c.getCashDrawer");   
        
        action.setParams({       
            employeeId : employeeId,
            accountId : accountId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                component.set('v.cashDrawer', res);
              	
                this.getPendingRemittances(component, employeeId);
                this.setCookie('CashDrawer', res.Id);    
                this.setCookie('CashDrawerStatus', res.Status__c);   
                
                var employee = component.get('v.employee');
                var appEvent = $A.get("e.c:POSAppEvent");
                appEvent.setParams({"employee": employee});
                appEvent.fire();
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
         
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
            
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    getPendingRemittances : function(component, employeeId) {
        var action = component.get("c.getPendingRemittances");   
        
        action.setParams({       
            employeeId : employeeId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                component.set('v.pendingRemittances', res);
              	
            
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
         
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
            
                    // Show error message
                }        
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    createSession : function(component, event) {
        var action = component.get("c.createCashDrawer");   
        var employee = component.get("v.employee");
        component.set('v.showSpinner', true);  //Show loading
        
        action.setParams({       
            employeeId : employee.Id,
            accountId : employee.AccountId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                component.set('v.cashDrawer', res);
                
                var appEvent = $A.get("e.c:POSAppEvent");
                appEvent.setParams({"employee": employee});
                appEvent.fire();
                
                
                
                var cashFloat = document.getElementById('cashDrawerItemFloatModal');
                $A.util.removeClass(cashFloat, 'slds-hide');
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    
                    // Show error message
                }     
            
            component.set('v.showSpinner', false);
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
   
    
    processOrder : function(component, event) {
      	var employee = component.get('v.employee');
        var qty = component.get('v.qty');
        var order = component.get('v.order');
        var orderItem = component.get('v.orderItem');
        var orderType = component.get('v.orderTypeOptionSelected');
        var modeOfPayment = component.get('v.modeOfPaymentSelected');
        
        if(order == null){
            order = new Object();
        }
        
       
        if(order.Total == null){
            order.Total = 0;
        }
        
        if(order.OrderItems == null){
            order.OrderItems = [];
        }
        
        order.AccountId = employee.AccountId;
        order.ContactId = employee.Id;
        order.OrderType = orderType;
        order.Total = order.Total + orderItem.UnitPrice;
        //order.ModeOfPayment = modeOfPayment;
        
        //recalculate the Change
        if(order.PaymentReceived != null && order.PaymentReceived != '0'){
            order.Change = parseInt(order.PaymentReceived) - order.Total;
            console.log(parseInt(order.PaymentReceived));
            console.log(order.Total);
        }
        
        
        order.OrderItems.push(orderItem);
        
        //Reset the order item
        component.set('v.orderItem', null);
        component.set("v.selectedProduct", null);
        component.set("v.order", order);
        console.log('Add to Cart');
        
    },
    
    applySrPwdDiscount : function(component, event) {
        var action = component.get("c.getSrDiscount");    
        var order = component.get('v.order');
        component.set('v.showSpinner', true);  //Show loading
        action.setParams({       
            posParams : JSON.stringify(order)
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                console.log('Discountable Products');
                console.log(res);
                
                res.forEach(function(element, index) {
                  	element.ProductName = element.Product2.Name + '(20% Discount)';
                });
                
               
                
                 console.log(res);
                component.set('v.discountedItems', res);
                component.set('v.error', '');
                
                 var discountedProdsModal = document.getElementById('discountedProdsModal');
                $A.util.removeClass(discountedProdsModal, 'slds-hide');
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    const errorObj = JSON.parse(errors[0].message);
                    console.log(errorObj.message);
                    component.set('v.error', errorObj.message);
                    // Show error message
                }  
            
            component.set('v.showSpinner', false);  //Show loading
            
        });               
        
        $A.enqueueAction(action);     
        
        
        
        
    },
    
    
    printReceipt: function(url) {
        window.open(url, '_blank');
        // Set a small delay for the second link
        /*
        setTimeout(function() {
            window.open(url2, '_blank');
        }, 500); // 500ms delay
        */
        
    },
    
    getCookie : function(queryParam) {
        
        let name = queryParam + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    
    setCookie : function(field, value) {
       
        var secure = 'secure;';
        var sameSite='SameSite=Lax;';
        var currentDomain = window.location.hostname + ';';
        document.cookie = field + "=" + value + ';';// + secure + sameSite + currentDomain; 
         
    },
    
    
    gotoURL : function(component, event, url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
    },
    
    
})