({
	handleOnChange : function(component, event, helper) {
        
        var amount = event.getSource().get("v.value");
        var totalAmount = component.get('v.totalAmount');
        if(amount < totalAmount){
            component.set('v.isRequired', true);
            component.set('v.isExactAmount', false);
        }else{
            component.set('v.isExactAmount', true);
            component.set('v.isRequired', false);
        }
        
    },
    
    save : function(component, event, helper) {
        var allValid = component.find('remit').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
        
        if(allValid){
            helper.updateOpportunity(component, event);
            
        }else{
             console.log('##FAIL');
        }
        
    },
    
    hideModal : function(component, event, helper) {
        
        var remittanceModal = document.getElementById('remittanceModal');
        $A.util.addClass(remittanceModal, 'slds-hide');
        
    },
    
})