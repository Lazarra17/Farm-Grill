({
	   getSessionId : function(component, event) {
        const leadId = localStorage.getItem('leadId');
        console.log('leadId: '+ leadId);
        if (leadId != null) {
            
            component.set("v.leadId", leadId);
            
        }else{
            
            
        }
        
    },
    
    getOrders : function(component, event) {
        var priceSum = 0;
        var leadId = component.get('v.leadId');
        var action = component.get("c.getOrders");    
        action.setParams({       
            leadId : leadId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();  
            var myOrders = [];
            var myCompletedOrders = [];
       
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                
                console.log(res);
                
                res.forEach(function(record) {
                    console.log(record.oppty.StageName);
                    if (record.oppty.StageName == 'Closed Won - Delivered') {
                       myCompletedOrders.push(record);
                    }else if (record.oppty.StageName == 'Pending Review' || record.oppty.StageName == 'Preparing' || record.oppty.StageName == 'Out for Delivery') {
                        myOrders.push(record);
                    }
                });
                
                component.set('v.myOrders', myOrders);
                component.set('v.myCompletedOrders', myCompletedOrders);
                
                
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
    
})