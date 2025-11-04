({
    hideModal : function(component, event, helper) {
        var varietyModal = document.getElementById('varietyModal');
        $A.util.addClass(varietyModal, 'slds-hide');
    },
    
    addOne : function(component, event, helper) {
        var qty = component.get("v.qty");
        qty = qty + 1;
        component.set('v.qty', qty);
    },
    
    minusOne : function(component, event, helper) {
        var qty = component.get("v.qty");
        if(qty > 1){
            qty = qty - 1;
            component.set('v.qty', qty);
        }
        
    },
    
    createOrderItem : function(component, event, helper) {
      	let prodId = event.getSource().get("v.value");
        var products = component.get('v.products');
        var qty = component.get('v.qty');
        var cashdrawer = component.get('v.cashDrawer');
        
        if(cashdrawer == null){
            component.set('v.error', 'No active cash drawer session.');
        }else{
            
            // Loop through the Map in JavaScript
            for (let key in products) {
                if (products.hasOwnProperty(key)) {
                    // Example: loop through the list inside
                    products[key].value.forEach(function(item) {
                        
                        if(prodId == item.Product__c){
                            
                            var orderItem = new Object();
                            orderItem.Product2Id = item.Product__c;
                            orderItem.UnitPrice = item.TECH_Unit_Price__c * qty;
                            orderItem.PricebookEntryId = item.TECH_PriceBookEntryId__c;
                            orderItem.ProductName = item.Product__r.Name;
                            orderItem.Quantity = qty;
                            
                            var appEvent = $A.get("e.c:POSAppEvent");
                            appEvent.setParams({"orderItem": orderItem, 
                                                "action": 'ADD_ORDER_ITEM'
                                               });
                            appEvent.fire();
                            
                            //reset quantity to 1
                            component.set('v.qty', 1);
                            
                            var varietyModal = document.getElementById('varietyModal');
                            $A.util.addClass(varietyModal, 'slds-hide');
                            
                        }
                        
                    });
                }
            }
            
        }
        
        
    },
    
})