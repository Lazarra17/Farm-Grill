({
    createOpportunity : function(component, event) {
        var order = component.get('v.order');
        var contact = component.get('v.contact');
        var selectElement = component.find("rider");
        var selectedValue = selectElement.get("v.value");
        var notes = component.get('v.notes');
        
        order.RiderId = selectedValue;
        order.Customer = contact;
        order.Notes = notes;
        var cashDrawer = component.get('v.cashDrawer');
        var employee = component.get('v.employee');
        var action = component.get("c.createDeliveryOpportunity");  
        var modeOfPayment = component.get('v.modeOfPaymentSelected');
        action.setParams({       
            posParams : JSON.stringify(order),
            cashDrawerId : cashDrawer.Id,
            mOP : modeOfPayment
        });   
        
        component.set('v.showSpinner', true);
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            console.log('state: ' + state);
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                
                var deliveryModal = document.getElementById('deliveryModal');
                $A.util.addClass(deliveryModal, 'slds-hide');
                
                /*
                var printModal = document.getElementById('printModal');
                $A.util.removeClass(printModal, 'slds-hide');
                */
                
                var appEvent = $A.get("e.c:POSAppEvent");
                appEvent.setParams({"employee": employee});
                appEvent.setParams({"opportunity": res});
                appEvent.setParams({"action": 'deliveryOrder'});
                appEvent.fire();
                
                //Print Customer Receipt
                this.printReceipt(
                    '/s/receipt-customer?recordId=' + res.Id
                );
                
                
                
                
                
            } else if (state === "INCOMPLETE") {
                console.log("No response from server or client is offline.");
                
                // Show offline error
            }
                else if (state === "ERROR") {
                    var errors = response.getError();  
                    console.log("Error: " + errors[0].message);
                    
                    // Show error message
                }    
            
        component.set('v.showSpinner', false);
        });               
        
        $A.enqueueAction(action);     
        
        
    },
    
      printReceipt: function(url) {
        window.open(url, '_blank');
        // Set a small delay for the second link
        /*
        setTimeout(function() {
            window.open(url2, '_blank');
        }, 500); // 500ms delay
        */
        
    },
    
    
})