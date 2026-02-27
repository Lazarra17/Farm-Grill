({
    cancelOrder : function(component, event) {
        console.log('cancel order');
        var opptyId = component.get('v.opptyId');   
        var action = component.get("c.cancelOrder");    
        action.setParams({    
            opptyId : opptyId
        });   
        component.set('v.showSpinner', true);
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                
                if(res != null){
                    
                    
                    component.set('v.isDeleted', false);
                    var appEvent = $A.get("e.c:FGAppEvent");
                    appEvent.setParams({"leadId" : opptyId});
                    appEvent.fire();
                    
                }else{
                    console.log('deleted');
                    component.set('v.isDeleted', true);
                    
                    var appEvent = $A.get("e.c:FGAppEvent");
                    appEvent.setParams({"leadId" : opptyId});
                    appEvent.fire();
                    
                    var cancelOrderModal = document.getElementById('cancelOrderModal');
                    $A.util.addClass(cancelOrderModal, 'slds-hide');
                    
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
            
            component.set('v.showSpinner', false);
        });               
        
        $A.enqueueAction(action);     
        
        
        
        
    }
})