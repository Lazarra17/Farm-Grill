({
	doInit : function(component, event, helper) {
		var userId = helper.getCookie('ContactId');
        var CashDrawer = helper.getCookie('CashDrawer');
        console.log(userId);
        component.set('v.POSUserId', userId);
        component.set('v.CashDrawerId', CashDrawer);
	}
})