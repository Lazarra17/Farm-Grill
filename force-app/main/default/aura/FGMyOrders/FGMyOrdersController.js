({
    doInit : function(component, event, helper) {
        helper.getSessionId(component, event);
        helper.getOrders(component, event);
    },
    
    
    handleApplicationEvent : function(component, event, helper) {
        helper.getOrders(component, event);
    },
    
    openCancelModal : function(component, event, helper) {
        
        var opptyId = event.getSource().get("v.value");
        component.set('v.opptyId', opptyId);
        
        var cartRemoveItemModal = document.getElementById('cancelOrderModal');
        $A.util.removeClass(cartRemoveItemModal, 'slds-hide');
        
        
    },
    
    
    
})