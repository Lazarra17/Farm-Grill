({
	removeItem : function(component, event, helper) {
		var itemIndex = event.currentTarget.id;
        var order = component.get('v.order');
        var orderItems = order.OrderItems;
        var newItems = [];
        for(var num=0; num < orderItems.length; num++){
            if(num == itemIndex){
                console.log('Change: ' + order.Change);
                order.Change = order.Change + orderItems[num].UnitPrice;
                order.Total = order.Total - orderItems[num].UnitPrice;
                
                continue;
            }
            newItems.push(orderItems[num]);
        }
        
     
        order.OrderItems = newItems;
        
        if(order.OrderItems.length == 0){
            order.Cash = '0';
            order.Change = 0;
        }
        
        component.set('v.order', order);
        
        var myEvent = component.getEvent("compEvent");
        
        // Set attributes on the event
        myEvent.setParams({
            "order": order
        });
        
        // Fire the event
        myEvent.fire();
        
	}
})