({
    getPosSettings : function(component, event) {
        
        var action = component.get("c.getPosSettings");    
        action.setParams({       
            
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log('posSettings');
                console.log(res);
                
           
                
                component.set("v.posSettings", res);
                
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
    
    
    
    approveDiscount : function(component, event) {
        
        var posSettings = component.get('v.posSettings');
        var passcode = document.getElementById('approvalPasscode');
        
        if(passcode.value != posSettings.Discount_Passcode__c){
            component.set('v.error', 'Incorrect Passcode!');
        }else{
            
            passcode.value = '';
            var approvalModal = document.getElementById('approvalModal');
            $A.util.addClass(approvalModal, 'slds-hide');
            
            var varietyModal = document.getElementById('varietyModal');
            $A.util.removeClass(varietyModal, 'slds-hide');
            
        }   
        
        
    },
    
    
    
})