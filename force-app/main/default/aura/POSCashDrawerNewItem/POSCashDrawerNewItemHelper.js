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
                var url = '/forcepos/s/receipt-expense?recordId=' + res.Id;
                        // 1. Create a dynamic anchor element using '_blank'
                var link = document.createElement('a');
                link.href = url;
                link.target = '_blank'; // Correct target syntax for new tab
                link.rel = 'noopener noreferrer';
                
                // 2. Trigger the click event
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                 
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