({
    doInit : function(component, event, helper) {
        
        var actions = [
            { label: 'Remit', name: 'remit' }
        ];
        
        component.set('v.mycolumns', [
            { label: 'Name', fieldName: 'Name', type: 'text'},
            { label: 'Stage', fieldName: 'StageName', type: 'text'},
            { label: 'Payment Status', fieldName: 'Payment_Status__c', type: 'text'},
            {
                label: 'Total Amount',
                fieldName: 'Amount',
                type: 'currency',
                typeAttributes: { currencyCode: 'PHP'}
            },
            {label: "Remit",
             type: "button",
             initialWidth: 150,
             typeAttributes: {
                 label: "Remit",
                 name: "remit",
                 title: "Remit to Cashier",
                 variant: 'destructive-text',
                 class: 'btn-table'
             }}
        ]);
        
        component.set('v.cashDrawerSessionId', component.get('v.recordId'));
        
        helper.getPendingRemittances(component, event);
    },
    
    
    handleRowAction: function(component, event, helper) {
        var action = event.getParam("action");
        var row = event.getParam("row");
        if (action.name === "remit") {
            component.set('v.opportunityId', row.Id);
            component.set('v.totalAmount', row.Amount);
            component.set('v.opptyName', row.Name);
            
            var remittanceModal = document.getElementById('remittanceModal');
            $A.util.removeClass(remittanceModal, 'slds-hide');
            
            
        }
    },
    
    handleEvent: function(component, event, helper) {
        
        let pendingOpportunities = event.getParam("pendingOpportunities");
        console.log('Pending Oppty');
        console.log(pendingOpportunities);
        
        component.set("v.mydata", pendingOpportunities);
    },
    
    
})