({
    getProducts : function(component, event) {
        
        var action = component.get("c.getProducts");    
        action.setParams({       
            
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                var products = [];
                var priorities = [];
                for(var key in res){
                    
                    res[key].forEach(function(item, index) {
                        if(item.Popular__c == true){
                            console.log('popular Item');
                            priorities.push(item);
                        }
                        
                        
                    });
                    
                    
                    
                    products.push({value:res[key], key:key});
                }
                
                //Push the popular items
                if(priorities != null){
                    products.unshift({value:priorities, key:'Popular'});  
                    
                    
                    console.log('Priorities');
                    console.log(priorities)
                    
                    console.log('products');
                    console.log(products)
                }
                
                
                
                component.set("v.products", products);
                
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
    
    getCart : function(component, event) {
        var leadId = component.get("v.leadId");
        var action = component.get("c.getCart");    
        action.setParams({       
            leadId : leadId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                 console.log('cart');
                console.log(res);
             

                component.set("v.cartData", res);
                
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
    
    
    getSessionId : function(component, event) {
        const ipAddress = this.getIPAddress(component, event);
        const leadId = localStorage.getItem('leadId');
        console.log('leadId: '+ leadId);
        if (leadId != null) {
            
            component.set("v.leadId", leadId);
            
        }else{
     
           
        }
        
    },
    
    getIPAddress : function(component, event) {
        fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            console.log('User IP:', data.ip);
            component.set('v.ipAddress', data.ip);
        })
            .catch(error => console.error('Error fetching IP:', error));
        },
            
            
})