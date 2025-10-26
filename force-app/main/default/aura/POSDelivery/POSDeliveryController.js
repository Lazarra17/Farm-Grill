({
	hideModal : function(component, event, helper) {
        var deliveryModal = document.getElementById('deliveryModal');
        $A.util.addClass(deliveryModal, 'slds-hide');
        //helper.endSession(component, event);
    },
    
    placeOrder : function(component, event, helper) {
      
        var allValid = component.find('contact').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
        var selectElement = component.find("customer");
        var selectedValue = selectElement.get("v.value");
        
        if (selectedValue === "" || selectedValue === null) {
            // Display error message
            selectElement.showHelpMessageIfInvalid();
            allValid = false;
        }
        
        var riderElement = component.find("rider");
        var riderValue = riderElement.get("v.value");
        
        if (riderValue === "" || riderValue === null) {
            // Display error message
            riderElement.showHelpMessageIfInvalid();
            allValid = false;
        }
        
        if (allValid) {
            
            helper.createOpportunity(component, event);
            
            
        }
        
    },
    
    handleRiderChange : function(component, event, helper) {
        
        var selectedValue = event.target.value;
        component.set("v.riderSelected", selectedValue);
        
    }, 
    
    handleCustomerChange : function(component, event, helper) {
        
        var selectedValue = event.target.value;
        component.set("v.customerSelected", selectedValue);
        
        var customers = component.get('v.existingCustomers');
        console.log(customers);
        for(var key in customers){
            
            if(customers[key].Id == selectedValue){
                var obj = new Object();
                obj.Id = customers[key].Id;
                obj.FirstName = customers[key].FirstName;
                obj.LastName = customers[key].LastName;
                obj.MobilePhone = customers[key].MobilePhone;
                obj.Complete_Address__c = customers[key].Complete_Address__c;
                obj.AccountId = customers[key].AccountId;
                component.set('v.contact', obj);
            }
        }    
        
        var allValid = component.find('contact').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
    }, 
    
    
    handleChange : function(component, event, helper) {
        var selectedValue = event.getParam("value");
        component.set('v.customerType', selectedValue);
       
        
    },  
    

    onRowSelection : function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.selectedRows', selectedRows);
        // you can do something with selectedRows here
        console.log('Selected rows: ' + JSON.stringify(selectedRows));
    }

    
})