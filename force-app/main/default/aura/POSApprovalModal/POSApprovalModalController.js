({
    
    doInit : function(component, event, helper) {
        
        helper.getPosSettings(component, event);
        
        
        
        
        
    },
    
    hideModal : function(component, event, helper) {
        var approvalModal = document.getElementById('approvalModal');
        $A.util.addClass(approvalModal, 'slds-hide');
    },
    
    
    approve : function(component, event, helper) {
        
        helper.approveDiscount(component, event);
        
    },
    
    applyDiscount : function(component, event, helper) {
        
        helper.approveSrPwdDiscount(component, helper);
        
    },
    
    
    
    loginViaEnter : function(component, event, helper) {
        var keyPressed = event.key; // Get the character value
        var discountType = component.get('v.discountType');
        // var physicalKey = event.code; // Get the physical key pressed
        if(keyPressed == 'Enter'){
            if(discountType == 'SR/PWD Discount'){
                helper.approveSrPwdDiscount(component, helper);
            }else{
                helper.approveDiscount(component, event);
            }
            
        }
        
        
    },
    
    
})