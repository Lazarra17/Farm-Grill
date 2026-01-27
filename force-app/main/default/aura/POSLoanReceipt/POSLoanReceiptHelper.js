({
    getReceiptData : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getReceiptData");    
        
        action.setParams({       
            recordId : recordId
        });   

        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log('LOAN');
                console.log(res);
            
                
                component.set("v.receiptData", res);
                
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
        
        
    },
    
    getReceiptSettings : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getReceiptSettings");    
        
        action.setParams({       
         
        });   

        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log('RES');
                console.log(res);
                
                
                component.set("v.receiptSettings", res);
               
                
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
})