({
	doInit : function(component, event, helper) {
        
        var actions = [
            { label: 'Reconcile', name: 'reconcile' }
        ];
        
        component.set('v.mycolumns', [
            { label: 'Cash Drawer Id', fieldName: 'Name', type: 'text'},
            { label: 'Cashier', fieldName: 'Cashier', type: 'text'},
            { label: 'Status', fieldName: 'Status__c', type: 'text'},
            { 
                label: 'Start Date', 
                fieldName: 'Start_Date__c', 
                type: 'date',
                typeAttributes: {
                    day: 'numeric',
                    month: 'short', // 'short', '2-digit', or 'long'
                    year: 'numeric'
                }
            },
            {
                label: 'Expected Count',
                fieldName: 'Expected_Count__c',
                type: 'currency',
                typeAttributes: { currencyCode: 'PHP'}
            },
            {
                label: 'Ending Count',
                fieldName: 'Ending_Count__c',
                type: 'currency',
                typeAttributes: { currencyCode: 'PHP'}
            },
            {
                label: 'Difference',
                fieldName: 'Difference__c',
                type: 'currency',
                typeAttributes: { currencyCode: 'PHP'}
            },
            {label: "Action",
             type: "button",
             initialWidth: 150,
             typeAttributes: {
                 label: "Reconcile",
                 name: "reconcile",
                 title: "Reconcile Cash Register",
                 variant: 'destructive-text',
                 class: 'btn-table'
             }}
        ]);
        
        var accountId = helper.getCookie('AccountId');
        var contactId = helper.getCookie('contactId');
        if(accountId != ''){
            helper.getCashDrawers(component, accountId);
        }
        
        if(contactId != ''){
            helper.getContact(component, contactId);
        }
        
        
    },
    
    handleEvent: function(component, event, helper) {
        
        let cashDrawers = event.getParam("cashDrawers");
        cashDrawers.forEach(function(row, index) {
            if(row.hasOwnProperty('Contact__r')){
                row.Cashier = row.Contact__r.Name;//Customer__r.Name;
                
            }
        });
        
        
        component.set("v.mydata", cashDrawers);
        
    },
    
    
    
    handleRowAction: function(component, event, helper) {
        var action = event.getParam("action");
        var row = event.getParam("row");
        if (action.name === "reconcile") {
            console.log('reconcile');
            var cashDrawer = new Object();
            cashDrawer.Id = row.Id;
            cashDrawer.Name = row.Name;
            cashDrawer.Account__c = row.Account__c;
            cashDrawer.Expected_Count__c = row.Expected_Count__c;
            cashDrawer.Ending_Count__c = row.Ending_Count__c;
            cashDrawer.Difference__c = row.Difference__c;
            console.log('reconcile 2');
            console.log(JSON.stringify(cashDrawer));
            component.set('v.cashDrawer', cashDrawer);
            
            var remittanceModal = document.getElementById('cashDrawersModal');
            $A.util.removeClass(remittanceModal, 'slds-hide');
            
            
        }
    },
    
    
    
})