({
    save : function(component, event, helper) {
        var amount = component.get('v.amount');
        var stockLevel = component.get('v.stockLevel');
        var allValid = false;
        
        if(amount == null){
            component.set('v.errMessage', 'Quantity cannot be blank.');
        }else if(amount <= 0){
            component.set('v.errMessage', 'Quantity cannot be 0 or less.');
        }else{
            allValid = true;
        }
        
        
        if(allValid){
            helper.updateStockLevel(component, event);
            
        }else{
            console.log('##FAIL');
        }
        
    },
    
    hideModal : function(component, event, helper) {
        
        var productModal = document.getElementById('productModal');
        $A.util.addClass(productModal, 'slds-hide');
        
    }
})