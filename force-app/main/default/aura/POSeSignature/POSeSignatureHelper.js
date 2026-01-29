({
    startDrawing: function(cmp, x, y) {
        cmp.set("v.isDrawing", true);
        let canvas = cmp.find("signatureCanvas").getElement();
        let ctx = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        
        // Get coordinates (handling both mouse and touch)
        let clientX = event.clientX || event.touches[0].clientX;
        let clientY = event.clientY || event.touches[0].clientY;
        
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        
        let startX = (clientX - rect.left) * scaleX;
        let startY = (clientY - rect.top) * scaleY;
        
        ctx.beginPath(); // <--- CRITICAL: Clears the previous path buffer
        ctx.moveTo(startX, startY); // <--- CRITICAL: Moves th
    },
    
    draw: function(cmp, x, y) {
        if (!cmp.get("v.isDrawing")) return;
        
        let canvas = cmp.find("signatureCanvas").getElement();
        let ctx = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        
        // 1. Calculate the scale ratio between internal resolution and visual size
        // Internal width is canvas.width (e.g. 400), visual width is rect.width (e.g. 100%)
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        
        // 2. Adjust for position AND apply the scale
        let drawX = (x - rect.left) * scaleX;
        let drawY = (y - rect.top) * scaleY;
        
        ctx.lineTo(drawX, drawY);
        ctx.stroke();
    },
    
    stopDrawing: function(cmp) {
        if(cmp.get("v.isDrawing")) {
            cmp.set("v.isDrawing", false);
            this.save(cmp);
        }
    },
    
    save: function(cmp) {
        let canvas = cmp.find("signatureCanvas").getElement();
        let dataURL = canvas.toDataURL("image/png");
        cmp.set("v.signatureData", dataURL);
        cmp.set("v.isAccepted", true);
    }
})