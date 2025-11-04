({
    doInit : function(component, event, helper) {
        
        var employeeCode = helper.getCookie('employeeCode');
        var cashDrawer = helper.getCookie('CashDrawer');
        component.set('v.cashDrawer', cashDrawer);
        
        if(document.cookie != null){
            
            let obj = {};
            document.cookie.split(";").forEach(pair => {
                let [key, value] = pair.split("=");
                if (key && value) {
                key = key.trim();
                value = value.trim();
                obj[key] = value;
            }
                                               });
            
            
            console.log('COOKIE' + obj);
            console.log(JSON.stringify(obj));
            component.set('v.employee', obj);
        }
        
        
     
    },
    
    signout : function(component, event, helper) {
        document.cookie = "FirstName=;";
        document.cookie = "ContactId=;";
        document.cookie = "AccountId=;";
        document.cookie = "CashDrawer=;";
        document.getElementById('headerMenu').classList.remove('show');
        document.getElementById('headerMenu').classList.add('collapse');
        console.log('Cookie on Signout: ' + document.cookie);
        helper.gotoURL(component, event, '/s/');
    },
    
    handleApplicationEvent : function(component, event, helper) {
        var employee = event.getParam("employee");
        
        if(employee != null){
            component.set("v.employee", employee);
            
            var cashDrawer = helper.getCookie('CashDrawer');
            component.set('v.cashDrawer', cashDrawer);
        }
        
    },
    
    onClick : function(component, event, helper) {
        
        
        
        var id = event.target.dataset.menuItemId;
        if (id) {
            component.getSuper().navigate(id);
        }
        
        document.getElementById('headerMenu').classList.remove('show');
        document.getElementById('headerMenu').classList.add('collapse');
        
    },
    
    hideModal : function() {
        
        document.getElementById('headerMenu').classList.remove('show');
        document.getElementById('headerMenu').classList.add('collapse');
        
    },
})