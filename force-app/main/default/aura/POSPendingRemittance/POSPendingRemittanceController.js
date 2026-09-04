({
    doInit : function(component, event, helper) {
        
        var actions = [
            { label: 'Remit', name: 'remit' }
        ];
        
        component.set('v.mycolumns', [
            { label: 'Name', fieldName: 'Name', type: 'text'},
            { label: 'Customer', fieldName: 'Customer', type: 'text'},
            {
                label: 'Date',
                fieldName: 'CreatedDate',
                type: 'date',
                typeAttributes: {
                    month: "short",
                    day: "2-digit",
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Manila' 
                }
            },
            { label: 'Stage', fieldName: 'StageName', type: 'text'},
            //{ label: 'Payment Status', fieldName: 'Payment_Status__c', type: 'text'},
            {
                label: 'Total Amount',
                fieldName: 'Amount',
                type: 'currency',
                typeAttributes: { currencyCode: 'PHP'}
            },
            {label: "Remit",
             type: "button",
             initialWidth: 100,
             typeAttributes: {
                 label: "Remit",
                 name: "remit",
                 title: "Remit to Cashier",
                 variant: 'destructive-text',
                 class: 'btn-table'
             }},
            {label: "Print Receipt",
             type: "button",
             initialWidth: 120,
             typeAttributes: {
                 label: "Print",
                 name: "print",
                 title: "Remit to Cashier",
                 class: 'btn-table'
             }}
        ]);
        
        component.set('v.cashDrawerSessionId', component.get('v.recordId'));
        
        helper.getPendingRemittances(component, event);
        
        var contactId = helper.getCookie('ContactId');
        var accountId = helper.getCookie('AccountId');
        
        if(contactId != '' && accountId != ''){
             helper.getCashDrawer(component, contactId, accountId);
        }
       
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
        
        if (action.name === "print") {
            console.log('Open');
            component.set('v.opportunityId', row.Id);
            var addressableUrl = '/forcepos/s/receipt-customer?recordId=' + row.Id;
            
            // 1. Create a dynamic anchor element using '_blank'
            var link = document.createElement('a');
            link.href = addressableUrl;
            link.target = '_blank'; // Correct target syntax for new tab
            link.rel = 'noopener noreferrer';
            
            // 2. Trigger the click event
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            
        }
    },
    
    handleEvent: function(component, event, helper) {
        
        let pendingOpportunities = event.getParam("pendingOpportunities");
        if(pendingOpportunities != null){
            
            pendingOpportunities.forEach(function(row, index) {
                if(row.hasOwnProperty('Customer__r')){
                    row.Customer = row.Customer__r.Name;//Customer__r.Name;
                    
                }
            });
            
            component.set("v.mydata", pendingOpportunities);
            
            if(pendingOpportunities != null){
                component.set('v.pendingRemittances', pendingOpportunities.length);
            }else{
                component.set('v.pendingRemittances', 0);
            }
            
            
            var contactId = helper.getCookie('ContactId');
            var accountId = helper.getCookie('AccountId');
            
            if(contactId != '' && accountId != ''){
                helper.getCashDrawer(component, contactId, accountId);
            }

        }else{
            component.set('v.mydata', null);
        }        
        
    },
    
    getCookie : function(queryParam) {
        
        let name = queryParam + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    
    
})