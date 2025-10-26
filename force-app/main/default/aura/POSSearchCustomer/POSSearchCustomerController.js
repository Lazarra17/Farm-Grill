({
    doInit : function(component, event, helper) {
        // define columns
        component.set('v.columns', [
            {label: 'Name', fieldName: 'Name', type: 'text', sortable: true},
            {label: 'Mobile Phone', fieldName: 'MobilePhone', type: 'phone'},
            {label: 'Complete Address', fieldName: 'Complete_Address__c', type: 'text'}
        ]);
        
        
    },
    
})