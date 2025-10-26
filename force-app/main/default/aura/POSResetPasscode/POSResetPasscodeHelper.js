({
    updatePasscode : function(component, newPasscode) {
        var contact = component.get('v.contact');
        console.log('1');
        var action = component.get("c.updatePasscode");    
        action.setParams({       
            contactId : contact.Id,
            passcode : newPasscode
        });   
         console.log('1t');
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
               
                console.log('password has been reset');
                component.set("v.isPasscodeReset", true);
                
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
})