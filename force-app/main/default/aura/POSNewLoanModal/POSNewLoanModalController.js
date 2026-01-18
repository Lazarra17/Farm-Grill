({
    hideModal : function(component, event, helper) {
        var newLoanModal = document.getElementById('newLoanModal');
        $A.util.addClass(newLoanModal, 'slds-hide');
    },
    
    doInit : function(component, event, helper) {
        var contactId = component.get('v.contactId');
        var flow = component.find("myFlow");
        var inputVariables = [
            { name : "recordId", type : "String", value : contactId }
        ];
        flow.startFlow("POS_New_Loan_Advance", inputVariables); // Replace with your Flow's API Name
        
    },
    
    
    
})