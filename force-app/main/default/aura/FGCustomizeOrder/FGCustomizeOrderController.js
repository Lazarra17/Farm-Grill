({
	doInit : function(component, event, helper) {
        
        
        helper.getSessionId(component, event);
		helper.getProductDetail(component, event);
        helper.getBeverages(component, event);
        helper.getDesserts(component, event);
        helper.getIPAddress(component, event);
        
    },
    
    onRender : function(component, helper) {
        // Prevent infinite loops by checking a flag
        if (!component.get("v.isFullyRendered")) {
            
            // Using a timeout ensures the browser has finished the paint cycle
            window.setTimeout($A.getCallback(function() {
                if (component.isValid()) {
                    component.set("v.isFullyRendered", true);
                    console.log("All elements are rendered!");
                }
            }), 0);
        }
    },
    
    
    addBeverage : function(component, event, helper) {
        var prodVal = event.getSource().get("v.value");
        var isChecked = event.getSource().get("v.checked");
        var selectedBeverages = component.get("v.selectedBeverages");
        
        if(isChecked){
            
            selectedBeverages.push(prodVal);
        }else{
            
            selectedBeverages = selectedBeverages.filter(item => item !== prodVal);
            
        }
        component.set('v.selectedBeverages', selectedBeverages);
    },
    
    addDessert : function(component, event, helper) {
        var prodVal = event.getSource().get("v.value");
        var isChecked = event.getSource().get("v.checked");
        var selectedDesserts = component.get("v.selectedDesserts");
        
        console.log('isChecked: ' + isChecked);
        if(isChecked){
            
            selectedDesserts.push(prodVal);
        }else{
            
            selectedDesserts = selectedDesserts.filter(item => item !== prodVal);
            
        }
        
        component.set('v.selectedDesserts', selectedDesserts);
    },
    
    handleDecrement : function(component, event, helper) {
        var count = component.get('v.qty');
        if(count > 1){
            component.set('v.qty', count - 1);
        }
        
    },
    
    
    handleIncrement : function(component, event, helper) {
        var count = component.get('v.qty');
        component.set('v.qty', count + 1);
    },
    
    addToCart : function(component, event, helper) {
        
        var storedId = localStorage.getItem('leadId');
        console.log('StoreOd: ' + storedId);
        if(storedId != null){
   console.log('updateLEad: ');            
            helper.updateLead(component, event);
        }else{
            console.log('createLEad: ');
            helper.createLead(component, event);
        }
        
    },
    
    
})