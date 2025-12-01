({
    
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
    
    gotoURL : function(component, event, url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
      //  urlEvent.fire();
    },
    
    getCashDrawer : function(component, cashDrawerId) {
        var action = component.get("c.checkCashDrawer");   
     
        action.setParams({       
            cashDrawerId : cashDrawerId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                console.log('res: ' + res);
                //get Cash Drawer
                if(res == null){
                    this.gotoURL(component, event,'/s/');
                }else{
                    component.set('v.cashDrawer', res);
                }
                
                
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