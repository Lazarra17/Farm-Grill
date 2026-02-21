({
	doInit : function(component, event, helper) {
        helper.getSessionId(component, event);
        helper.getBarangays(component, event);
        helper.getMunicipality(component, event);
        helper.getLeadItems(component, event);
	},
    
    applyDeliveryFee : function(component, event, helper) {
        var selectedValue = event.getSource().get("v.value");
        helper.addDelivery(component, event);
    }
    
})