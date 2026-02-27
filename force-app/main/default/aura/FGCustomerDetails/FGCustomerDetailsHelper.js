({
    
    getSessionId : function(component, event) {
        const leadId = localStorage.getItem('leadId');
        console.log('leadId: '+ leadId);
        if (leadId != null) {
            
            component.set("v.leadId", leadId);
            
        }else{
            
            
        }
        
    },
    
    getBarangays : function(component, event) {
        
        
        var action = component.get("c.getPicklistValues");    
        action.setParams({       
            objectName : 'Contact',
            fieldName : 'Barangay_Sitio__c'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
             
              
                
                component.set("v.barangayOptions", res);
                
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
    
    getMunicipality : function(component, event) {
        
        
        var action = component.get("c.getPicklistValues");    
        action.setParams({       
            objectName : 'Contact',
            fieldName : 'Municipality_City__c'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                
                
                
                component.set("v.municipalityOptions", res);
                
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
    
    getLead : function(component, event) {
        var priceSum = 0;
        var leadId = component.get('v.leadId');
        var action = component.get("c.getLead");    
        action.setParams({       
            leadId : leadId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                component.set('v.lead', res);
                
                
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
    
    getLeadItems : function(component, event) {
        var priceSum = 0;
        var leadId = component.get('v.leadId');
        var action = component.get("c.getLeadItems");    
        action.setParams({       
            leadId : leadId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                component.set('v.leadItems', res);
                
                res.forEach(function(res, index) {
                    priceSum = priceSum + res.Total_Price__c;
                });
                console.log('priceSum: ' + priceSum);
                component.set('v.grandTotal', priceSum);
                
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
    
    
    addDelivery : function(component, event) {
        var lead = component.get("v.lead");
        var leadId = component.get('v.leadId');
        var action = component.get("c.addDelivery");    
        action.setParams({    
            leadId : leadId,
            barangay : lead.Barangay_Sitio__c
        });   
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                 console.log('CONTACT');
                console.log(res);
                this.getLeadItems(component, event);
                
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
        var lead = component.get("v.lead");
        var action = component.get("c.updateLead");    
        action.setParams({    
            lead : lead
        });   
      //  component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log('update lead');
                console.log(res);
                component.set('v.lead', res);
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    // Show error message
                } 
            
             //component.set('v.showSpinner', false);
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
    placeOrder : function(component, event) {
        var lead = component.get("v.lead");
        var action = component.get("c.placeOrder");    
        action.setParams({    
            lead : lead
        });   
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                component.set('v.lead', res);
                
                var appEvent = $A.get("e.c:FGAppEvent");
                appEvent.setParams({"leadId" : lead.Id});
                appEvent.fire();
                
                this.navigateToUrl(component, event, '/s/my-orders');
                
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
    
    navigateToUrl : function(component, event, url) {
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
        
        
        
    },
    
})