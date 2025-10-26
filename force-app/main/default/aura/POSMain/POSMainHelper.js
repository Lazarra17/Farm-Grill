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
                console.log('PRODUCTS');
                console.log(res);
                
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
                console.log('PRODUCTS');
                console.log(res);
                
                var products = [];
                for(var key in res){
                    products.push({value:res[key], key:key});
                }
                
                console.log('PRODUCT CATEGORIES');
                console.log(JSON.stringify(products));
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
                console.log('EXISTING CUSTOMERS');
                console.log(res);
                
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
                    if(key == 'Dine-in'){
                        component.set('v.orderTypeOptionSelected', res[key]);
                    }
                    picklistObj.push({value:res[key], label:key});
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
                console.log(picklistObj);
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
    
    
    getModeOfPayment : function(component, event) {
        
        var action = component.get("c.getPicklistValues");    
        action.setParams({       
            objectName : 'Opportunity',
            fieldName : 'Mode_of_Payment__c'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();      
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                var picklistObj = [];
                
                
                for(var key in res){
                    
                    picklistObj.push(key);
                }
                component.set("v.modeOfPaymentOptions", picklistObj);
                
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
                    
                    // Show error message
                }    
       
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
                console.log('getContact');
                console.log(res);
                if(res != null){
                    component.set('v.employee', res);
                    this.setCookie("username", res.Username__c);
                    this.setCookie("firstName", res.FirstName);
                    this.setCookie("contactId", res.Id);
                    this.setCookie("accountId", res.AccountId);
                    //document.cookie = "employeeCode=" + employeeCode; 
                }else{
                    this.setCookie("firstName", "");
                    this.setCookie("contactId", "");
                    this.setCookie("accountId", "");
                    
                }
                
                this.getCashDrawer(component, res.Id);
                this.getRiders(component, event);
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
                console.log('CONTACT');
                console.log(res);
                if(res != null){
                    component.set('v.employee', res);
                    this.setCookie("username", username);
                    this.setCookie("FirstName", res.FirstName);
                    this.setCookie("ContactId", res.Id);
                    this.setCookie("AccountId", res.AccountId);
                    
                    this.getCashDrawer(component, res.Id);
                    this.getExistingCustomers(component, res.AccountId);
                 	this.getRiders(component, event);
                    
                }else{
                    this.setCookie("FirstName", "");
                    this.setCookie("ContactId", "");
                    this.setCookie("AccountId", "");
                    
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
    
    getCashDrawer : function(component, employeeId) {
        var action = component.get("c.getCashDrawer");   
        
        action.setParams({       
            employeeId : employeeId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                component.set('v.cashDrawer', res);
              	
                console.log("Cash Drawer");
                console.log(res);
                this.setCookie('CashDrawer', res.Id);    
                
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
                
                var cashFloat = document.getElementById('cashFloatItemModal');
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
        var amount = orderItem.UnitPrice * qty;
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
        order.Total = order.Total + amount;
        order.ModeOfPayment = modeOfPayment;
        //orderItem.Quantity = qty;
        //orderItem.UnitPrice = amount;
        
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
        component.set("v.qty", 1);
        console.log('Add to Cart');
        console.log(JSON.stringify(order));
        
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