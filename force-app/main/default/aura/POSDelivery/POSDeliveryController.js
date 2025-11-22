({
	hideModal : function(component, event, helper) {
        var deliveryModal = document.getElementById('deliveryModal');
        $A.util.addClass(deliveryModal, 'slds-hide');
        //helper.endSession(component, event);
    },
    
    placeOrder : function(component, event, helper) {
        var employee = component.get('v.employee');
    	var order = component.get('v.order');
        var orderType = component.get('v.orderType');
        
        var allValid = component.find('contact').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
        var customerType = component.get('v.customerType');
        
        if(customerType == 'Existing Customer'){
            
            var selectElement = component.find("customer");
            var selectedValue = selectElement.get("v.value");
            if (selectedValue === "" || selectedValue === null) {
                
                // Display error message
                selectElement.showHelpMessageIfInvalid();
                allValid = false;
            }
        }
        
        if(orderType == 'Delivery'){
            var riderElement = component.find("rider");
            var riderValue = riderElement.get("v.value");
            if (riderValue === "" || riderValue === null) {
                // Display error message
                riderElement.showHelpMessageIfInvalid();
                allValid = false;
            }
            
        }
        
        
        if(employee.Role__c == 'Customer Service Representative'){
            var cashierElement = component.find("cashier");
            var cashierValue = cashierElement.get("v.value");
            if (cashierValue === "" || cashierValue === null) {
                // Display error message
                cashierElement.showHelpMessageIfInvalid();
                allValid = false;
            }
        }
        
        if (allValid) {
            console.log('VALID' + orderType);
            
            if(orderType == 'Delivery'){
                var hasDeliveryProduct = false;
                order.OrderItems.forEach(function(item) {
                    
                    if(item.ProductName.includes('Delivery') ){
                        hasDeliveryProduct = true;
                    }
                });
                
                if(hasDeliveryProduct){
                    component.set('v.errMessage', '');
                    helper.createOpportunity(component, event);
                }else{
                    console.log('VALID FALSE');
                    component.set('v.errMessage', 'Missing Delivery Fee.');
                }
            }else if(orderType == 'Pickup'){
                
                helper.createOpportunity(component, event);
                
            }
        }
        
    },
    
    handleRiderChange : function(component, event, helper) {
        
        var selectedValue = event.target.value;
        component.set("v.riderSelected", selectedValue);
        
    }, 
    
    handleCashierChange : function(component, event, helper) {
        
        var selectedValue = event.target.value;
        component.set("v.cashierSelected", selectedValue);
        
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
       
        //reset values
        var conOjb = new Object();
        conOjb.FirstName = '';
        conOjb.LastName = '';
        conOjb.MobilePhone = ''; 
        conOjb.Complete_Address__c = '';
        
        component.set('v.contact', conOjb);
        component.set('v.notes', '');
        component.set('v.riderSelected', '');
        component.set('v.cashierSelected', '');
        component.set('v.customerSelected', '');
        
        
    },  
    

    onRowSelection : function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.selectedRows', selectedRows);
        // you can do something with selectedRows here
        console.log('Selected rows: ' + JSON.stringify(selectedRows));
    }

    
})