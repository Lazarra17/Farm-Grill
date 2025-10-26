({
    getPendingRemittances : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getPendingOpportunity");   
        
        action.setParams({       
            cashDrawerItemId : recordId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                console.log('menu: ');
                console.log(res);
                
                if(res == null){
                    this.gotoURL('/s');
                }
                
               
                component.set('v.mydata', res);
                
                
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
    
    gotoURL : function(url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
    },
})