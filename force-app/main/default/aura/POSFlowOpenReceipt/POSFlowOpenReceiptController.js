({
	doInit : function(component, event, helper) {
		var basePath = window.location.origin;
        var recordId = component.get('v.recordId');
        var path = component.get('v.path');
        var url = basePath + '/forcepos/s' + path + '?recordId=' + recordId;
        console.log('path: ' + basePath);
        component.set('v.url', url);
        
        var url = '/forcepos/s/receipt-expense?recordId=' + res.Id;
                // 1. Create a dynamic anchor element using '_blank'
        var link = document.createElement('a');
        link.href = url;
        link.target = '_blank'; // Correct target syntax for new tab
        link.rel = 'noopener noreferrer';
        
        // 2. Trigger the click event
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
	}
})