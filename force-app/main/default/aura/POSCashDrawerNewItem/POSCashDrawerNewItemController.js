({
    save : function(component, event, helper) {
        var total = component.get('v.total');
        var type = component.get('v.type');
        var allValid = component.find('newItem').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
        
        
        var selectElement = component.find("type");
        var selectedValue = selectElement.get("v.value");
        
        if (selectedValue === "" || selectedValue === null) {
            // Display error message
            selectElement.showHelpMessageIfInvalid();
        }
        
        if(total == null || total == 0){
            component.set('v.errMessage', 'Amount cannot be blank or 0.');
            allValid = false;
        }
        
        if (allValid) {
            
            
                helper.createCashDrawerItem(component, event, selectedValue);
         
        }
    },
    
    
    hideModal : function(component, event, helper) {
        var modalId = component.get('v.modalId');
        var cashDrawerItemModal = document.getElementById(modalId);
        $A.util.addClass(cashDrawerItemModal, 'slds-hide');
    },
    
    endSession : function(component, event, helper) {
        
    },
    
    calculateTotal : function(component, event, helper) {
        var cashDrawerItem = component.get('v.cashDrawerItem');
        var x1000 = cashDrawerItem.X1000__c != '' || cashDrawerItem.X1000__c != null  ? cashDrawerItem.X1000__c * 1000 : 0;
        var x500 = cashDrawerItem.X500__c != '' || cashDrawerItem.X500__c != null ? cashDrawerItem.X500__c * 500 : 0;
        var x200 = cashDrawerItem.X200__c != '' || cashDrawerItem.X200__c != null ? cashDrawerItem.X200__c * 200 : 0;
        var x100 = cashDrawerItem.X100__c != '' || cashDrawerItem.X100__c != null ? cashDrawerItem.X100__c * 100 : 0;
        var x50 = cashDrawerItem.X50__c != '' || cashDrawerItem.X50__c != null ? cashDrawerItem.X50__c * 50 : 0;
        var x20 = cashDrawerItem.X20__c != '' || cashDrawerItem.X20__c != null ? cashDrawerItem.X20__c * 20 : 0;
        var x10 = cashDrawerItem.X10__c != '' || cashDrawerItem.X10__c != null ? cashDrawerItem.X10__c * 10 : 0;
        var x5 = cashDrawerItem.X5__c != '' || cashDrawerItem.X5__c != null ? cashDrawerItem.X5__c * 5 : 0;
        var x1 = cashDrawerItem.X1__c != '' || cashDrawerItem.X1__c != null ? cashDrawerItem.X1__c * 1 : 0;
        
        var total = x1000 + x500 + x200 + x100 + x50 + x20 + x10 + x5 + x1;
        component.set('v.total', total);
        
    },
    
    
    
    
})