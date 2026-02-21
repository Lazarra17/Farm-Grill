({
    doInit : function(component, event, helper) {
        helper.getSessionId(component, event);
        helper.getCart(component, event);
        
    },
    
    navigateToCart : function(component, event, helper) {
        helper.gotoURL(component, event, '/s/cart');
    },
    
    handleApplicationEvent : function(component, event, helper) {
 
        var leadId = event.getParam("leadId");
        helper.getCart(component, event);
        
        
        
    },
    
    
    
    
})