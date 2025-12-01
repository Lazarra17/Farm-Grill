({
	updateCashDrawer : function(component, event) {
        var cashDrawer = component.get('v.cashDrawer');
        var status = component.get('v.status');
        var note = component.get('v.note');
        var action = component.get("c.updateCashDrawer");   
        
        
        component.set('v.showSpinner', true);
        
        action.setParams({      
            cashdrawerJSON : JSON.stringify(cashDrawer),
            status: status,
            note: note
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                console.log('Update drawer');
              
                component.set('v.status', '');
                component.set('v.note', '');
                
                let compEvent = component.getEvent("compEvent");
                compEvent.setParams({ "cashDrawers" : res});
                compEvent.fire();
                
                component.set('v.showSpinner', false);
                
                var remittanceModal = document.getElementById('cashDrawersModal');
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