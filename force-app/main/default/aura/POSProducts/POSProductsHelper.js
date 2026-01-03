({
	getProductStocks : function(component, event) {
        var action = component.get("c.getProductStocks");   
        
        action.setParams({      
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                
                res.forEach(function(row, index) {
                    if(row.hasOwnProperty('Product__r')){
                        row.ProductName = row.Product__r.Name;
                        row.ProductFamily = row.Product__r.Family;
                    }
                });
                
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
    
    getCookie : function(queryParam) {
        
        let name = queryParam + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
})