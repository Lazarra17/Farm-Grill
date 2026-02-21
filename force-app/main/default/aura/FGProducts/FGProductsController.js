({
    selectProduct : function(component, event, helper) {
        var selectedDiv = event.currentTarget;
        
        // 2. Access the data-value attribute
        var productValue = selectedDiv.dataset.value;
        
        helper.gotoURL(component, event, '/customize-order?recordId=' + productValue);
        
    }
})