({
    hideModal : function(component, event, helper) {
        
        var remittanceModal = document.getElementById('cashDrawersModal');
        $A.util.addClass(remittanceModal, 'slds-hide');
        
    },
    
    save : function(component, event, helper) {
        var allValid = component.find('cdrawer').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
            
        }, true); // The 'true' here is the initial value for validSoFar
        
 
        
        
        if(allValid){
            helper.updateCashDrawer(component, event);
            
        }else{
        }
        
    },
    
    
})