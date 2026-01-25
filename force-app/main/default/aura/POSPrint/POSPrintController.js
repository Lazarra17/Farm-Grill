({
    hideModal : function(component, event, helper) {
       
        var printModal = document.getElementById('printModal');
        $A.util.addClass(printModal, 'slds-hide');
    },
    
    printCustReceipt : function(component, event, helper) {
        var opp = component.get("v.opp");
        var posSettings = component.get('v.posSettings');
        window.open('/forcepos/s/receipt-customer?recordId=' + opp.Id, '_blank');
    },
    
    printKitchenReceipt : function(component, event, helper) {
        var opp = component.get("v.opp");
        var posSettings = component.get('v.posSettings');
        window.open('/forcepos/s/receipt-kitchen?recordId=' + opp.Id, '_blank');
    },
    
    newOrder : function(component, event, helper) {
        
        var appEvent = $A.get("e.c:POSAppEvent");
        appEvent.setParams({"order": null});
        appEvent.setParams({"action": 'ordersComplete'});
        appEvent.fire();
        
        var printModal = document.getElementById('printModal');
        $A.util.addClass(printModal, 'slds-hide');
        
        
    },
})