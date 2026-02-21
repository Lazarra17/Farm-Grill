({
    getProductDetail : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getProductDetail");    
        action.setParams({       
            recordId : recordId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();                  
                component.set("v.product", res);
                
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
    
    getBeverages : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getProductsByCategory");    
        action.setParams({       
            category : 'Beverages'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
              console.log(res);
                component.set("v.beverages", res);
                
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
    
    getDesserts : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getProductsByCategory");    
        action.setParams({       
            category : 'Dessert'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
              	console.log(res);
                component.set("v.desserts", res);
                
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
    
    addToCart : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getProductsByCategory");    
        action.setParams({       
            category : 'Dessert'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                component.set("v.desserts", res);
                
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
    
    createLead : function(component, event) {
        var ipAddress = component.get('v.ipAddress');
        var product = component.get('v.product');
        var qty = component.get('v.qty');
        var notes = component.get('v.notes');
        var selectedDesserts = component.get('v.selectedDesserts');
        var selectedBeverages = component.get('v.selectedBeverages');
        
        var action = component.get("c.createLead");    
        component.set('v.showSpinner', true);
        
        action.setParams({       
            product : product,
            quantity : qty,
            beverages : selectedBeverages,
            desserts : selectedDesserts,
            notes : notes,
            ipAddress : ipAddress
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log('TEST');
                console.log(res);
                
                
                //Set Lead Id to Local Storage
                localStorage.setItem('leadId', res.Id);
                component.set('v.leadId', res.Id);
                
                var appEvent = $A.get("e.c:FGAppEvent");
                appEvent.setParams({"leadId": res.Id});
                appEvent.fire();
                
                this.gotoURL(component, event, '/s');
           
                
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
    
    updateLead : function(component, event) {
        var ipAddress = component.get('v.ipAddress');
        var leadId = component.get('v.leadId');
        var product = component.get('v.product');
        var qty = component.get('v.qty');
        var notes = component.get('v.notes');
        var selectedDesserts = component.get('v.selectedDesserts');
        var selectedBeverages = component.get('v.selectedBeverages');
        component.set('v.showSpinner', true);
        var action = component.get("c.updateLead");    
        action.setParams({      
            leadId : leadId,
            product : product,
            quantity : qty,
            beverages : selectedBeverages,
            desserts : selectedDesserts,
            notes : notes,
            ipAddress : ipAddress
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                
                var appEvent = $A.get("e.c:FGAppEvent");
                appEvent.setParams({"leadId": leadId});
                appEvent.fire();
                
                
                this.gotoURL(component, event, '/s');
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
    
    gotoURL : function(component, event, url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
    },
    
    getSessionId : function(component, event) {
        const ipAddress = this.getIPAddress(component, event);
        const leadId = localStorage.getItem('leadId');
        console.log('leadId: '+ leadId);
        if (leadId != null) {
            
            component.set("v.leadId", leadId);
            
        }else{
            
            
        }
        
    },
    
    
    getIPAddress : function(component, event) {
        fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            console.log('User IP:', data.ip);
            component.set('v.ipAddress', data.ip);
        })
            .catch(error => console.error('Error fetching IP:', error));
        },
            
        })