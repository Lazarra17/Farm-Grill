({
    doInit : function(component, event, helper) {
        
        var recordId = component.get('v.recordId');
        if(recordId != null){
            
            helper.getCashDrawer(component, recordId);
        }else{
            helper.gotoURL(component, event, '/s/');
        }
        
    },
    
    newItem : function(component, event, helper) {
        
        var cashDrawerItemModal = document.getElementById('cashDrawerItemModal');   
        $A.util.removeClass(cashDrawerItemModal, 'slds-hide');
    },
    
})