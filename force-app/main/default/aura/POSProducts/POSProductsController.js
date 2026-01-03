({
    doInit : function(component, event, helper) {
        
        var actions = [
            { label: 'Update', name: 'update' }
        ];
        
        component.set('v.mycolumns', [
            { label: 'Name', fieldName: 'ProductName', type: 'text'},
            { label: 'Family', fieldName: 'ProductFamily', type: 'text'},
            { label: 'Available to Sell', fieldName: 'Available_to_Sell__c', type: 'text'},
            { label: 'Count on Hand', fieldName: 'Count_on_Hand__c', type: 'text'},
            {label: "Update",
             type: "button",
             initialWidth: 150,
             typeAttributes: {
                 label: "Update",
                 name: "update",
                 title: "Update Stock Level",
                 variant: 'brand-text',
                 class: 'btn-table'
             }}
        ]);
        
        var contactId = helper.getCookie('ContactId');
        component.set('v.contactId', contactId);
        helper.getProductStocks(component, event);
        
    },
    
    
    handleRowAction: function(component, event, helper) {
        var stockLevel = component.get('v.stockLevel');
        var action = event.getParam("action");
        var row = event.getParam("row"); 
          console.log('TRUE' + action.name);
        if (action.name === "update") {
            
            stockLevel.Id = row.Id;
            stockLevel.ProductName = row.ProductName;
            component.set('v.stockLevel', stockLevel);
            var productModal = document.getElementById('productModal');
            $A.util.removeClass(productModal, 'slds-hide');
            
            
        }
    },
    
    handleEvent: function(component, event, helper) {
        
        let productStocks = event.getParam("productStocks");
        
        productStocks.forEach(function(row, index) {
            if(row.hasOwnProperty('Product__r')){
                row.ProductName = row.Product__r.Name;
                row.ProductFamily = row.Product__r.Family;
            }
        });
        
        component.set("v.mydata", productStocks);
        
    },
    

    
})