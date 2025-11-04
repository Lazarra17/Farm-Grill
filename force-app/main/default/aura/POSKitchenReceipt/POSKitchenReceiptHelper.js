({
    getOppty : function(component, event) {
        var recordId = component.get('v.recordId');
        
        if(recordId != null){
            
            var action = component.get("c.getReceiptData");    
            
            action.setParams({       
                recordId : recordId
            });   
            
            action.setCallback(this, function(response) {            
                
                var state = response.getState();            
                //console.log('state: ' + state);
                if (state === "SUCCESS") {
                    var res = response.getReturnValue();  
                    console.log('PRODUCTS');
                    console.log(res);
                    
                    component.set("v.receiptData", res);
                    
                    setTimeout($A.getCallback(function() {
                        window.onafterprint = function() {
                            window.close();
                        };
                        window.print();
                    }), 500);
                    
                    
                    
                } else if (state === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    // Show offline error
                }
                    else if (state === "ERROR") {
                        var errors = response.getError();  
                        console.log("Error: " + errors[0].message);
                        // Show error message
                    }        
            });               
            
            $A.enqueueAction(action);     
            
        }
        
    }
})