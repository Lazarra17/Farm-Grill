({
    getSessionId : function(component, event) {
        const leadId = localStorage.getItem('leadId');
        console.log('leadId: '+ leadId);
        if (leadId != null) {
            
            component.set("v.leadId", leadId);
            
        }else{
            
            
        }
        
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
    
    updateLeadItem : function(component, event, method) {
        var leadId = component.get('v.leadId');
        const prodId = event.currentTarget.dataset.id;
        console.log('prodId: ' + prodId);
        var action = component.get("c.updateLeadItem");    
        action.setParams({       
            leadItemId : prodId,
            method : method
        });   
        
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                
                var appEvent = $A.get("e.c:FGAppEvent");
                appEvent.setParams({"leadId" : leadId});
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
            
            component.set('v.showSpinner', false);
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
})