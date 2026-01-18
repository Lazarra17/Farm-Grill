({
    doInit : function(component, event, helper) {
        component.set('v.cashDrawerSessionId', component.get('v.recordId'));
        
        helper.getPendingRemittances(component, event);
        
        var contactId = helper.getCookie('ContactId');
        var accountId = helper.getCookie('AccountId');
        
        if(document.cookie != null){
            
            let obj = {};
            document.cookie.split(";").forEach(pair => {
                let [key, value] = pair.split("=");
                if (key && value) {
                key = key.trim();
                value = value.trim();
                obj[key] = value;
            }
                                               });
            
            console.log('Menu: ' + JSON.stringify(obj));
            component.set('v.employee', obj);
            
        }
        
        
        if(contactId != '' && accountId != ''){
            helper.getCashDrawer(component, contactId, accountId);
        }
    }
})