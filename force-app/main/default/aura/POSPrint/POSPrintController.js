({
    hideModal : function(component, event, helper) {
       
        var printModal = document.getElementById('printModal');
        $A.util.addClass(printModal, 'slds-hide');
    },
    
    printCustReceipt : function(component, event, helper) {
        var opp = component.get("v.opp");
        var posSettings = component.get('v.posSettings');
        var addressableUrl = '/forcepos/s/receipt-customer?recordId=' + opp.Id;
        
        // 1. Create a dynamic anchor element using '_blank'
        var link = document.createElement('a');
        link.href = addressableUrl;
        link.target = '_blank'; // Correct target syntax for new tab
        link.rel = 'noopener noreferrer';
        
        // 2. Trigger the click event
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        
        
    },
    
    printKitchenReceipt : function(component, event, helper) {
        var opp = component.get("v.opp");
        var posSettings = component.get('v.posSettings');
        //window.open('/forcepos/s/receipt-kitchen?recordId=' + opp.Id, '_blank');
        var addressableUrl = '/forcepos/s/receipt-kitchen?recordId=' + opp.Id;
        
        // 1. Create a dynamic anchor element using '_blank'
        var link = document.createElement('a');
        link.href = addressableUrl;
        link.target = '_blank'; // Correct target syntax for new tab
        link.rel = 'noopener noreferrer';
        
        // 2. Trigger the click event
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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