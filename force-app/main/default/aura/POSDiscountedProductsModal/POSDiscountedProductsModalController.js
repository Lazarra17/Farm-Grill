({
    doInit : function(component, event, helper) {
        
        var actions = [
            { label: 'Apply Discount', name: 'applyDiscount' }
        ];
        
        component.set('v.mycolumns', [
            { label: 'Name', fieldName: 'ProductName', type: 'text'},
            { label: 'Price', fieldName: 'UnitPrice', type: 'text', initialWidth: 120},
            {label: "Action",
             type: "button",
             initialWidth: 150,
             typeAttributes: {
                 label: "Select",
                 name: "select",
                 title: "Select Product",
                 variant: 'brand-text',
                 class: 'btn-table'
             }}
        ]);
        
       // helper.getDiscountableProducts(component, event);
        
        
    },
    
    handleRowAction : function(component, event, helper) {
       
        var action = event.getParam("action");
        var row = event.getParam("row");
        if (action.name === "select") {
            
            var orderItem = new Object();
            orderItem.Product2Id = row.Product2Id;
            orderItem.UnitPrice = row.UnitPrice;
            orderItem.PricebookEntryId = row.Id;
            orderItem.ProductName = row.ProductName;
            orderItem.POS_Display_Name__c = row.ProductName;
            orderItem.Quantity = 1;
            
            var appEvent = $A.get("e.c:POSAppEvent");
            appEvent.setParams({"orderItem": orderItem, 
                                "action": 'ADD_ORDER_ITEM'
                               });
            appEvent.fire();
            
            
            var discountedProdsModal = document.getElementById('discountedProdsModal');
            $A.util.addClass(discountedProdsModal, 'slds-hide');
            
            
        }
        
    },
    
    hideModal : function(component, event, helper) {
        var discountedProdsModal = document.getElementById('discountedProdsModal');
        $A.util.addClass(discountedProdsModal, 'slds-hide');
    },
    

    
})