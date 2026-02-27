({
	doInit : function(component, event, helper) {
		helper.getSessionId(component, event);
        helper.getLeadItems(component, event);
    },
    
    handleApplicationEvent : function(component, event, helper) {
        
        var leadId = event.getParam("leadId");
        helper.getLeadItems(component, event);
        
        
        
    },
    
    handleDecrement : function(component, event, helper) {
        const prodId = event.currentTarget.dataset.id;
        var leadItems = component.get("v.leadItems");
        leadItems.forEach(function(res, index) {
         
            if(prodId == res.Id){
                
                if(res.Quantity__c > 1){
                    res.Quantity__c = res.Quantity__c - 1;
                    component.set('v.leadItems', leadItems);
                    
                    helper.updateLeadItem(component, event, 'MINUS');
                }else{
                    component.set('v.removeItem', prodId);
                    
                    var printModal = document.getElementById('cartRemoveItemModal');
                    $A.util.removeClass(printModal, 'slds-hide');
                }
                
            }
            
        });
        
       
        
    },
    
    handleIncrement : function(component, event, helper) {
        const prodId = event.currentTarget.dataset.id;
        var leadItems = component.get("v.leadItems");
        leadItems.forEach(function(res, index) {
            
            if(prodId == res.Id){
                
                if(res.Quantity__c < 30){
                    res.Quantity__c = res.Quantity__c + 1;
                    
                    component.set('v.leadItems', leadItems);
                    helper.updateLeadItem(component, event, 'ADD');
                    
                    
                }else{
                   
                }
                
            }
            
        });
        
               
    },
    
    
    navigateToCustomerPage : function(component, event, helper) {
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/s/customer-details"
        });
        urlEvent.fire();
        
        
        
    },
    
    
    navigateToHome : function(component, event, helper) {
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/s"
        });
        urlEvent.fire();
        
        
        
    },
    
    
    
})