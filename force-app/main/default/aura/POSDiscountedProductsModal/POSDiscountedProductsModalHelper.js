({
	getDiscountableProducts : function(component, event) {
        var order = component.get('v.order');
        var action = component.get("c.getDiscountableProducts");    
        action.setParams({       
            order : JSON.stringify(order)
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                /*
                var products = [];
                for(var key in res){
                    products.push({value:res[key], key:key});
                }
                */
                
               // component.set("v.products", products);
                
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