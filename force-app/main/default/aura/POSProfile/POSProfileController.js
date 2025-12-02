({
	doInit : function(component, event, helper) {
		var contactId = helper.getCookie('ContactId');
        if(contactId != null){
            component.set('v.recordId', contactId);
            
            helper.getContact(component, event);
        }
	},
    
    
    resetPasscode : function(component, event, helper) {
        var printModal = document.getElementById('resetPasscodeModal');
        $A.util.removeClass(printModal, 'slds-hide');
    },
    
})