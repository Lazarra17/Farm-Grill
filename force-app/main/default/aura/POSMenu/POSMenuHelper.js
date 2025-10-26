({
	 getAccount : function(component, employeeCode) {
        var action = component.get("c.getAccount");   
        
        action.setParams({       
            employeeCode : employeeCode
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();    
            if (state === "SUCCESS") {
                
                var res = response.getReturnValue();
                console.log('menu: ');
                console.log(res);
                if(res != null){
                    component.set('v.employee', res);
                    document.cookie = "employeeCode=" + employeeCode; 
                    document.cookie = "employeeId=" + res.Id; 
                }else{
                    document.cookie = "employeeCode="; 
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
    
    
    setCookie : function(field, value) {
       
        var secure = 'secure;';
        var sameSite='SameSite=Lax;';
        var currentDomain = window.location.hostname + ';';
        document.cookie = field + "=" + value + ';' + secure + sameSite + currentDomain; 
         
    },
    
    hideModal : function() {
        
        document.getElementById('headerMenu').classList.remove('show');
        document.getElementById('headerMenu').classList.add('collapse');
        
    },
    
    gotoURL : function(component, event, url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
    },
    
})