({
	doInit : function(component, event, helper) {
		var basePath = window.location.origin;
        var recordId = component.get('v.recordId');
        var path = component.get('v.path');
        var url = basePath + '/forcepos/s' + path + '?recordId=' + recordId;
        console.log('path: ' + basePath);
        component.set('v.url', url);
        
        window.open(url, '_blank');
        
	}
})