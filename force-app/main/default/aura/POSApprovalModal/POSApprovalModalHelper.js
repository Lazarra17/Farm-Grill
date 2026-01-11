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
    
    
	approveSrPwdDiscount : function(component, event) {
        
        var posSettings = component.get('v.posSettings');
        var idType = component.get('v.idType');
        var contact = component.get('v.contact');
        
        var allValid = component.find("contactForm").reduce(function (validSoFar, inputCmp) {
            // Show help message if the field is invalid
            inputCmp.reportValidity();
            // Return whether the current field is valid AND all previous fields were valid
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        
      
        
        if(contact.Passcode != posSettings.Discount_Passcode__c){
            component.set('v.error', 'Incorrect Passcode!');
            allValid = false;
        }
        
        if(allValid){
            
            var action = component.get("c.createSrPwdRecord");    
            action.setParams({       
                con : contact
            });   
            
            action.setCallback(this, function(response) {            
                
                var state = response.getState();            
                //console.log('state: ' + state);
                if (state === "SUCCESS") {
                    var res = response.getReturnValue();  
                    
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
            
            
            var appEvent = $A.get("e.c:POSAppEvent");
            appEvent.setParams({"action": 'APPLY_SR_PWD_DISCOUNT'});
            appEvent.fire();
            
            var approvalModal = document.getElementById('approvalModal');
            $A.util.addClass(approvalModal, 'slds-hide');
            
            
            
        }
        else{
            console.log('NOT VALID');
        }
        
        
    },
    
    
})