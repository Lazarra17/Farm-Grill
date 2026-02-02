({
    createCashDrawerItem : function(component, event, type) {
        var cashDrawerId = component.get('v.cashDrawerId');
        var cashDrawerItem = component.get('v.cashDrawerItem');
        var action = component.get("c.createCashDrawerItem");   
        var posSettings = component.get('v.posSettings');
        component.set('v.showSpinner', true);
        
        
        action.setParams({       
            cashDrawerId : cashDrawerId,
            cashDrawerItem : JSON.stringify(cashDrawerItem),
            type : type
        });    
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                 '/apex/ReceiptCustomerVfp?id=' + res.Id
                window.open('/forcepos/s/receipt-expense?recordId=' + res.Id, '_blank');
                 
                var cashDrawerItemModal = document.getElementById('cashDrawerItemModal');
                $A.util.addClass(cashDrawerItemModal, 'slds-hide');
                $A.get('e.force:refreshView').fire();
                
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