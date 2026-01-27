({
	doInit : function(component, event, helper) {
        
        
        helper.getReceiptData(component, event);
        helper.getReceiptSettings(component, event);
        
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');

        // Format: MM/DD/YY hh:mm AM/PM
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 → 12

        const formatted =
            pad(now.getMonth() + 1) + '/' +
            pad(now.getDate()) + '/' +
            String(now.getFullYear()).slice(-2) + ' ' +
            pad(hours) + ':' +
            pad(now.getMinutes()) + ' ' +
            ampm;

        
        component.set("v.dateTimeStamp", formatted);
        
     
    }
})