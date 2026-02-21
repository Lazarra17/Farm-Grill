({
    doInit : function(component, event, helper) {
        helper.getIPAddress(component, event);
        helper.getProducts(component, event);
        helper.getSessionId(component, event);
        helper.getCart(component, event);
    },
    
    navigateToCart : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/s/cart"
        });
        urlEvent.fire();
    },
    
    
    
})