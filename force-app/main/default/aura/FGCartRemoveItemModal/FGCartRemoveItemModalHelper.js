({
    deleteItem : function(component, event) {
        var leadItemId = component.get('v.leadItemId');
        var leadId = component.get('v.leadId');
        var action = component.get("c.deleteItem");  
        component.set('v.showSpinner', true);  //Show loading
        
        action.setParams({       
            leadItemId : leadItemId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();   
            if (state === "SUCCESS") {
                
                var appEvent = $A.get("e.c:FGAppEvent");
                appEvent.setParams({"leadId": leadId});
                appEvent.fire();
                
                var cartRemoveItemModal = document.getElementById('cartRemoveItemModal');
                $A.util.addClass(cartRemoveItemModal, 'slds-hide');
                
                
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
        
        
    }
})