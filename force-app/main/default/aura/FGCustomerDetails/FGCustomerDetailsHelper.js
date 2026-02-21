({
    
    getSessionId : function(component, event) {
        const leadId = localStorage.getItem('leadId');
        console.log('leadId: '+ leadId);
        if (leadId != null) {
            
            component.set("v.leadId", leadId);
            
        }else{
            
            
        }
        
    },
    
    getBarangays : function(component, event) {
        
        
        var action = component.get("c.getPicklistValues");    
        action.setParams({       
            objectName : 'Contact',
            fieldName : 'Barangay_Sitio__c'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
             
              
                
                component.set("v.barangayOptions", res);
                
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
    
    getMunicipality : function(component, event) {
        
        
        var action = component.get("c.getPicklistValues");    
        action.setParams({       
            objectName : 'Contact',
            fieldName : 'Municipality_City__c'
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                
                
                
                component.set("v.municipalityOptions", res);
                
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
    
    
    getLeadItems : function(component, event) {
        var priceSum = 0;
        var leadId = component.get('v.leadId');
        var action = component.get("c.getLeadItems");    
        action.setParams({       
            leadId : leadId
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                component.set('v.leadItems', res);
                
                res.forEach(function(res, index) {
                    priceSum = priceSum + res.Total_Price__c;
                });
                console.log('priceSum: ' + priceSum);
                component.set('v.grandTotal', priceSum);
                
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
    
    
    addDelivery : function(component, event) {
         console.log('CONTACT');
        var contact = component.get("v.Contact");
        var leadId = component.get('v.leadId');
        var action = component.get("c.addDelivery");    
       
        console.log(contact);
        action.setParams({    
            leadId : leadId,
            barangay : contact.Barangay_Sitio__c
        });   
        
        action.setCallback(this, function(response) {            
            
            var state = response.getState();            
            //console.log('state: ' + state);
            if (state === "SUCCESS") {
                var res = response.getReturnValue();  
                console.log(res);
                
                
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