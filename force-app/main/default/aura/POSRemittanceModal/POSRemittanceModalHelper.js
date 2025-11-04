({
    updateOpportunity : function(component, event) {
        var cashDrawerItem = component.get('v.cashDrawerItem');
        var type = component.get('v.type');
        var cashDrawerSessionId = component.get('v.cashDrawerSessionId');
        var opportunityId = component.get('v.opportunityId');
        var action = component.get("c.updateDeliveryOpportunity");   
        
        cashDrawerItem.Opportunity__c = opportunityId;
        cashDrawerItem.Cash_Drawer_Session__c = cashDrawerSessionId;
        
        component.set('v.showSpinner', true);
        
        action.setParams({      
            cashDrawerItemBody : JSON.stringify(cashDrawerItem),
            type: type
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                console.log('Update Oppty');
                console.log(res);
                //Reset the value of Reference Number
                cashDrawerItem.Reference_Number__c = '';
                cashDrawerItem.Custom__c = '';
                
                component.set('v.cashDrawerItem', cashDrawerItem);
                
                
                let compEvent = component.getEvent("compEvent");
                compEvent.setParams({ "pendingOpportunities" : res});
                compEvent.fire();
                
                component.set('v.showSpinner', false);
                
                var remittanceModal = document.getElementById('remittanceModal');
                $A.util.addClass(remittanceModal, 'slds-hide');
                
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
        
    }
})