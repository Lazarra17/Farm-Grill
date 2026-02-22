({
    doInit : function(component, event, helper) {
        helper.getSessionId(component, event);
        helper.getBarangays(component, event);
        helper.getMunicipality(component, event);
        helper.getLead(component, event);
        helper.getLeadItems(component, event);
    },
    
    applyDeliveryFee : function(component, event, helper) {
        var selectedValue = event.getSource().get("v.value");
        helper.addDelivery(component, event);
    },
    
    validateLeadUpdate : function(component, event, helper) {
        helper.updateLead(component, event);
    },
    
    validateOrder : function(component, event, helper) {
        
        var controls = component.find("leadForm");
        
        var fieldArray = [].concat(controls || []);
        
        var allValid = fieldArray.reduce(function (validSoFar, inputCmp) {
            
            if (inputCmp.showHelpMessageIfInvalid) {
                inputCmp.showHelpMessageIfInvalid();
            } else if (inputCmp.reportValidity) {
                inputCmp.reportValidity();
            }
            
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
         
        if (allValid) {
            helper.placeOrder(component, event);
        }
        
    },
    
    
    
})