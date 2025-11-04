({
    createOpportunity : function(component, event) {
        var order = component.get('v.order');
        var contact = component.get('v.contact');
        var selectElement = component.find("rider");
        var selectedValue = selectElement.get("v.value");
        
        var cashierElement = component.find("cashier");
        var cashierValue = selectElement.get("v.value");
        var modeOfPayment = component.get('v.modeOfPaymentSelected');
        
        var notes = component.get('v.notes');
        console.log('contact');
        console.log(JSON.stringify(contact));
        
        order.CashierId = component.get('v.cashierSelected');
        order.RiderId = selectedValue;
        order.Customer = contact;
        order.Notes = notes;
        order.ModeOfPayment = modeOfPayment;
        var cashDrawer = component.get('v.cashDrawer');
        var employee = component.get('v.employee');
        var action = component.get("c.createDeliveryOpportunity");  
        
        
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
                
                //reset values
                var conOjb = new Object();
                conOjb.FirstName = '';
                conOjb.LastName = '';
                conOjb.MobilePhone = ''; 
                conOjb.Complete_Address__c = '';
                component.set('v.contact', conOjb);
                
                component.set('v.notes', '');
                component.set('v.riderSelected', '');
                component.set('v.cashierSelected', '');
                component.set('v.customerSelected', '');
                
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