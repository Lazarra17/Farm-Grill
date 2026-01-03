({
    doInit : function(component, event, helper) {
        component.set('v.cashDrawerSessionId', component.get('v.recordId'));
        
        helper.getPendingRemittances(component, event);
        
        var contactId = helper.getCookie('ContactId');
        var accountId = helper.getCookie('AccountId');
        
        if(contactId != '' && accountId != ''){
            helper.getCashDrawer(component, contactId, accountId);
        }
    }
})