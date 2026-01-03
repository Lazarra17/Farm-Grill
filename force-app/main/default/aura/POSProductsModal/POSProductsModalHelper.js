({
    updateStockLevel : function(component, event) {
        var stockLevel = component.get('v.stockLevel');
        var amount = component.get('v.amount');
        var contactId = component.get('v.contactId');
        var action = component.get("c.updateStockLevel");   
        
        component.set('v.showSpinner', true);
        
        action.setParams({      
            stockLevelBody : JSON.stringify(stockLevel),
            contactId : contactId,
            amount : amount
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
             
                let compEvent = component.getEvent("compEvent");
                compEvent.setParams({ "productStocks" : res});
                compEvent.fire();
                
                //reset the value of amount
                component.set('v.amount', '');
                
                component.set('v.showSpinner', false);
                
                var productModal = document.getElementById('productModal');
                $A.util.addClass(productModal, 'slds-hide');
                
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