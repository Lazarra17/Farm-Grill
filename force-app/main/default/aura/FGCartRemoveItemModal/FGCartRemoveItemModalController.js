({
    hideModal : function(component, event, helper) {
        var cartRemoveItemModal = document.getElementById('cartRemoveItemModal');
        $A.util.addClass(cartRemoveItemModal, 'slds-hide');
    },
    
    removeItem : function(component, event, helper) {
        helper.deleteItem(component, event);
    },
})