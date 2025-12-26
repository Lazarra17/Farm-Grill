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
    
    loginViaEnter : function(component, event, helper) {
        var keyPressed = event.key; // Get the character value
        // var physicalKey = event.code; // Get the physical key pressed
       
        if(keyPressed == 'Enter'){
            helper.approveDiscount(component, event);
        }
        
        
    },
    
    
})