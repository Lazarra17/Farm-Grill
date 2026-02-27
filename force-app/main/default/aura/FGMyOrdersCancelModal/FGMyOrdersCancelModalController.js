({
    hideModal : function(component, event, helper) {
        component.set('v.isDeleted', true);
        component.set('v.showConfirmation', true);
        var cancelOrderModal = document.getElementById('cancelOrderModal');
        $A.util.addClass(cancelOrderModal, 'slds-hide');
    },
    
    removeOrder : function(component, event, helper) {
        helper.cancelOrder(component, event);
    },
})