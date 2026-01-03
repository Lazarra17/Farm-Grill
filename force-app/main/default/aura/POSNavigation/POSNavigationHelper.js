({
    getPendingRemittances : function(component, event) {
        var recordId = component.get('v.recordId');
        var action = component.get("c.getPendingOpportunity");   
        var contactId = this.getCookie('ContactId');
        
        action.setParams({       
            cashDrawerItemId : recordId,
            cashierId : contactId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                
                
                res.forEach(function(row, index) {
                    if(row.hasOwnProperty('Customer__r')){
                        row.Customer = row.Customer__r.Name;//Customer__r.Name;
                        
                    }
                });
                
                
                if(res != null){
                    component.set('v.pendingRemittances', res.length);
                }else{
                    component.set('v.pendingRemittances', 0);
                }
                
                /*
                if(res == null){
                    this.gotoURL('/s');
                }
             */   
               
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
    
    getCashDrawer : function(component, employeeId, accountId) {
        var action = component.get("c.getCashDrawer");   
        
        action.setParams({       
            employeeId : employeeId,
            accountId : accountId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                component.set('v.cashDrawer', res);
                
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
    
    
    gotoURL : function(url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
       // urlEvent.fire();
    },
})