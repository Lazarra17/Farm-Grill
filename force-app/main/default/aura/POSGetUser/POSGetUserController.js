({
	doInit : function(component, event, helper) {
		var userId = helper.getCookie('ContactId');
        console.log(userId);
        component.set('v.POSUserId', userId);
        
	}
})