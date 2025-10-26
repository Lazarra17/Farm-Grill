({
    hideModal : function(component, event, helper) {
        var cashDrawerItemModal = document.getElementById('resetPasscodeModal');
        $A.util.addClass(cashDrawerItemModal, 'slds-hide');
    },
    
    
    validateInput : function(component, event, helper) {
        var contact = component.get('v.contact');
        
        /*
        var allValid = component.find('resetInput').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
        */
        
        var oldps = component.find("oldps");
        var newps = component.find("newps");
        var conps = component.find("conps");
        
        
        var val1 = oldps.get("v.value");
        var val2 = newps.get("v.value");
        var val3 = conps.get("v.value");
        
        if (contact.Passcode__c !== val1) {
            // Show error on confirm field
            oldps.setCustomValidity('Passcode is incorrect.');
        }else if (val2 !== val3) {
            // Show error on confirm field
            newps.setCustomValidity('Passcode is not matched');
            conps.setCustomValidity('Passcode is not matched');
        }else {
            
            // Clear error
            oldps.setCustomValidity("");
            newps.setCustomValidity("");
            conps.setCustomValidity("");
        }
        
        
        
        
        if (oldps.reportValidity() && newps.reportValidity() && conps.reportValidity()) {
            
            helper.updatePasscode(component, val2);
            
        }
    },
    
 
    
    
    
})