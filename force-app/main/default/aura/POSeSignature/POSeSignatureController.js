({
    handleMouseDown: function(cmp, event, helper) {
        helper.startDrawing(cmp, event.clientX, event.clientY);
    },

    handleMouseMove: function(cmp, event, helper) {
        helper.draw(cmp, event.clientX, event.clientY);
    },

    handleMouseUp: function(cmp, event, helper) {
        helper.stopDrawing(cmp);
    },

    handleTouchStart: function(cmp, event, helper) {
        let touch = event.touches[0];
        helper.startDrawing(cmp, touch.clientX, touch.clientY);
    },

    handleTouchMove: function(cmp, event, helper) {
        event.preventDefault(); 
        let touch = event.touches[0];
        helper.draw(cmp, touch.clientX, touch.clientY);
    },

    handleTouchEnd: function(cmp, event, helper) {
        helper.stopDrawing(cmp);
    },

    clearSignature: function(cmp, event, helper) {
        let canvas = cmp.find("signatureCanvas").getElement();
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cmp.set("v.signatureData", null);
        cmp.set("v.isAccepted", false);
    }
})